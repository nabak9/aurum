import { CancellationToken } from '../utilities/cancellation_token';
import { Callback, ThenArg, Predicate } from '../utilities/common';
import { EventEmitter } from '../utilities/event_emitter';

export interface ReadOnlyDataSource<T> {
	readonly value: T;
	listenAndRepeat(callback: Callback<T>, cancellationToken?: CancellationToken): Callback<void>;
	listen(callback: Callback<T>, cancellationToken?: CancellationToken): Callback<void>;
	listenOnce(callback: Callback<T>, cancellationToken?: CancellationToken): Callback<void>;
	filter(callback: (newValue: T, oldValue: T) => boolean, cancellationToken?: CancellationToken): ReadOnlyDataSource<T>;
	unique(cancellationToken?: CancellationToken): ReadOnlyDataSource<T>;
	map<D>(callback: (value: T) => D, cancellationToken?: CancellationToken): ReadOnlyDataSource<D>;
	reduce(reducer: (p: T, c: T) => T, initialValue: T, cancellationToken?: CancellationToken): ReadOnlyDataSource<T>;
	awaitNextUpdate(cancellationToken?: CancellationToken): Promise<T>;
}

/**
 * Datasources wrap a value and allow you to update it in an observable way. Datasources can be manipulated like streams and can be bound directly in the JSX syntax and will update the html whenever the value changes
 */
export class DataSource<T> implements ReadOnlyDataSource<T> {
	/**
	 * The current value of this data source, can be changed through update
	 */
	public value: T;
	private primed: boolean;
	private updating: boolean;
	protected updateEvent: EventEmitter<T>;

	constructor(initialValue?: T) {
		this.value = initialValue;
		this.primed = initialValue !== undefined;
		this.updateEvent = new EventEmitter();
	}

	/**
	 * Updates the value in the data source and calls the listen callback for all listeners
	 * @param newValue new value for the data source
	 */
	public update(newValue: T): void {
		this.primed = true;
		if (this.updating) {
			throw new Error(
				'Problem in datas source: Unstable value propagation, when updating a value the stream was updated back as a direct response. This can lead to infinite loops and is therefore not allowed'
			);
		}
		this.updating = true;
		this.value = newValue;
		this.updateEvent.fire(newValue);
		this.updating = false;
	}

	/**
	 * Same as listen but will immediately call the callback with the current value first
	 * @param callback Callback to call when value is updated
	 * @param cancellationToken Optional token to control the cancellation of the subscription
	 * @returns Cancellation callback, can be used to cancel subscription without a cancellation token
	 */
	public listenAndRepeat(callback: Callback<T>, cancellationToken?: CancellationToken): Callback<void> {
		callback(this.value);
		return this.listen(callback, cancellationToken);
	}

	/**
	 * Subscribes to the updates of the data stream
	 * @param callback Callback to call when value is updated
	 * @param cancellationToken Optional token to control the cancellation of the subscription
	 * @returns Cancellation callback, can be used to cancel subscription without a cancellation token
	 */
	public listen(callback: Callback<T>, cancellationToken?: CancellationToken): Callback<void> {
		return this.updateEvent.subscribe(callback, cancellationToken).cancel;
	}

	/**
	 * Subscribes to the updates of the data stream for a single update
	 * @param callback Callback to call when value is updated
	 * @param cancellationToken Optional token to control the cancellation of the subscription
	 * @returns Cancellation callback, can be used to cancel subscription without a cancellation token
	 */
	public listenOnce(callback: Callback<T>, cancellationToken?: CancellationToken): Callback<void> {
		return this.updateEvent.subscribeOnce(callback, cancellationToken).cancel;
	}

	/**
	 * Creates a new datasource that listenes to updates of this datasource but only propagates the updates from this source if they pass a predicate check
	 * @param callback predicate check to decide if the update from the parent data source is passed down or not
	 * @param cancellationToken  Cancellation token to cancel the subscription the new datasource has to this datasource
	 */
	public filter(callback: (newValue: T, oldValue: T) => boolean, cancellationToken?: CancellationToken): TransientDataSource<T> {
		cancellationToken = cancellationToken ?? new CancellationToken();

		const filteredSource = new TransientDataSource<T>(cancellationToken);
		this.listen((value) => {
			if (callback(value, filteredSource.value)) {
				filteredSource.update(value);
			}
		}, cancellationToken);
		return filteredSource;
	}

	/**
	 * Creates a new datasource that listenes to updates of this datasource but only propagates the updates from this source if they are larger than the previous value
	 * In case of strings it checks alphabetical order when deciding what is bigger or smaller
	 * @param callback predicate check to decide if the update from the parent data source is passed down or not
	 * @param cancellationToken  Cancellation token to cancel the subscription the new datasource has to this datasource
	 */
	public max(cancellationToken?: CancellationToken): TransientDataSource<T> {
		return this.filter((newValue, oldValue) => {
			if (typeof newValue === 'string' && typeof oldValue === 'string') {
				return newValue.localeCompare(oldValue) > 0;
			} else {
				return newValue > oldValue;
			}
		}, cancellationToken);
	}

	/**
	 * Creates a new datasource that listenes to updates of this datasource but only propagates the updates from this source if they are smaller than the previous value
	 * In case of strings it checks alphabetical order when deciding what is bigger or smaller
	 * @param callback predicate check to decide if the update from the parent data source is passed down or not
	 * @param cancellationToken  Cancellation token to cancel the subscription the new datasource has to this datasource
	 */
	public min(cancellationToken?: CancellationToken): TransientDataSource<T> {
		return this.filter((newValue, oldValue) => {
			if (typeof newValue === 'string' && typeof oldValue === 'string') {
				return newValue.localeCompare(oldValue) < 0;
			} else {
				return newValue < oldValue;
			}
		}, cancellationToken);
	}

	/**
	 * Forwards all updates from this source to another
	 * @param targetDataSource datasource to pipe the updates to
	 * @param cancellationToken  Cancellation token to cancel the subscription the target datasource has to this datasource
	 */
	public pipe(targetDataSource: DataSource<T>, cancellationToken?: CancellationToken): void {
		this.listen((v) => targetDataSource.update(v), cancellationToken);
	}

	/**
	 * Creates a new datasource that is listening to updates from this datasource and transforms them with a mapper function before fowarding them to itself
	 * @param callback mapper function that transforms the updates of this source
	 * @param cancellationToken  Cancellation token to cancel the subscription the new datasource has to this datasource
	 */
	public map<D>(callback: (value: T) => D, cancellationToken?: CancellationToken): TransientDataSource<D> {
		cancellationToken = cancellationToken ?? new CancellationToken();

		let mappedSource;
		if (this.primed) {
			mappedSource = new TransientDataSource<D>(cancellationToken, callback(this.value));
		} else {
			mappedSource = new TransientDataSource<D>(cancellationToken);
		}
		this.listen((value) => {
			mappedSource.update(callback(value));
		}, cancellationToken);
		return mappedSource;
	}

	/**
	 * Allows tapping into the stream and calls a function for each value.
	 */
	public tap(callback: (value: T) => void, cancellationToken?: CancellationToken): DataSource<T> {
		this.listen((value) => {
			callback(value);
		}, cancellationToken);
		return this;
	}

	/**
	 * Creates a new datasource that is listening to updates from this datasource and transforms them with a mapper function before fowarding them to itself
	 * @param callback mapper function that transforms the updates of this source
	 * @param cancellationToken  Cancellation token to cancel the subscription the new datasource has to this datasource
	 */
	public await<R extends ThenArg<T>>(cancellationToken?: CancellationToken): TransientDataSource<R> {
		cancellationToken = cancellationToken ?? new CancellationToken();

		const mappedSource = new TransientDataSource<R>(cancellationToken);
		this.listen(async (value) => {
			mappedSource.update(await (value as any));
		}, cancellationToken);
		return mappedSource;
	}

	/**
	 * Creates a new datasource that listens to this one and forwards updates if they are not the same as the last update
	 * @param cancellationToken  Cancellation token to cancel the subscription the new datasource has to this datasource
	 */
	public unique(cancellationToken?: CancellationToken): TransientDataSource<T> {
		cancellationToken = cancellationToken ?? new CancellationToken();

		const uniqueSource = new TransientDataSource<T>(cancellationToken, this.value);
		this.listen((value) => {
			if (value !== uniqueSource.value) {
				uniqueSource.update(value);
			}
		}, cancellationToken);
		return uniqueSource;
	}

	/**
	 * Creates a new datasource that listens to this one and forwards updates revealing the previous value on each update
	 * @param cancellationToken  Cancellation token to cancel the subscription the new datasource has to this datasource
	 */
	public diff(cancellationToken?: CancellationToken): TransientDataSource<{ new: T; old: T }> {
		cancellationToken = cancellationToken ?? new CancellationToken();

		const diffingSource = new TransientDataSource(cancellationToken, {
			new: this.value,
			old: undefined
		});
		this.listen((value) => {
			diffingSource.update({
				new: value,
				old: diffingSource.value
			});
		}, cancellationToken);
		return diffingSource;
	}

	/**
	 * Creates a new datasource that listens to this source and combines all updates into a single value
	 * @param reducer  function that aggregates an update with the previous result of aggregation
	 * @param initialValue initial value given to the new source
	 * @param cancellationToken  Cancellation token to cancel the subscription the new datasource has to this datasource
	 */
	public reduce(reducer: (p: T, c: T) => T, initialValue: T, cancellationToken?: CancellationToken): TransientDataSource<T> {
		cancellationToken = cancellationToken ?? new CancellationToken();

		const reduceSource = new TransientDataSource<T>(cancellationToken, initialValue);
		this.listen((v) => reduceSource.update(reducer(reduceSource.value, v)), cancellationToken);

		return reduceSource;
	}

	/**
	 * Combines two sources into a third source that listens to updates from both parent sources.
	 * @param otherSource Second parent for the new source
	 * @param combinator Method allowing you to combine the data from both parents on update. Called each time a parent is updated with the latest values of both parents
	 * @param cancellationToken  Cancellation token to cancel the subscriptions the new datasource has to the two parent datasources
	 */
	public aggregate<D, E>(otherSource: DataSource<D>, combinator: (self: T, other: D) => E, cancellationToken?: CancellationToken): TransientDataSource<E> {
		cancellationToken = cancellationToken ?? new CancellationToken();
		const aggregatedSource = new TransientDataSource<E>(cancellationToken, combinator(this.value, otherSource.value));

		this.listen(() => aggregatedSource.update(combinator(this.value, otherSource.value)), cancellationToken);
		otherSource.listen(() => aggregatedSource.update(combinator(this.value, otherSource.value)), cancellationToken);

		return aggregatedSource;
	}

	/**
	 * Combines three sources into a fourth source that listens to updates from all parent sources.
	 * @param second Second parent for the new source
	 * @param third Third parent for the new source
	 * @param combinator Method allowing you to combine the data from all parents on update. Called each time a parent is updated with the latest values of all parents
	 * @param cancellationToken  Cancellation token to cancel the subscriptions the new datasource has to the parent datasources
	 */
	public aggregateThree<D, E, F>(
		second: DataSource<D>,
		third: DataSource<E>,
		combinator: (self: T, second: D, third: E) => F,
		cancellationToken?: CancellationToken
	): TransientDataSource<F> {
		cancellationToken = cancellationToken ?? new CancellationToken();
		const aggregatedSource = new TransientDataSource<F>(cancellationToken, combinator(this.value, second.value, third.value));

		this.listen(() => aggregatedSource.update(combinator(this.value, second.value, third.value)), cancellationToken);
		second.listen(() => aggregatedSource.update(combinator(this.value, second.value, third.value)), cancellationToken);
		third.listen(() => aggregatedSource.update(combinator(this.value, second.value, third.value)), cancellationToken);

		return aggregatedSource;
	}

	/**
	 * Combines four sources into a fifth source that listens to updates from all parent sources.
	 * @param second Second parent for the new source
	 * @param third Third parent for the new source
	 * @param fourth Fourth parent for the new source
	 * @param combinator Method allowing you to combine the data from all parents on update. Called each time a parent is updated with the latest values of all parents
	 * @param cancellationToken  Cancellation token to cancel the subscriptions the new datasource has to the parent datasources
	 */
	public aggregateFour<D, E, F, G>(
		second: DataSource<D>,
		third: DataSource<E>,
		fourth: DataSource<F>,
		combinator: (self: T, second: D, third: E, fourth: F) => G,
		cancellationToken?: CancellationToken
	): TransientDataSource<G> {
		cancellationToken = cancellationToken ?? new CancellationToken();
		const aggregatedSource = new TransientDataSource<G>(cancellationToken, combinator(this.value, second.value, third.value, fourth.value));

		this.listen(() => aggregatedSource.update(combinator(this.value, second.value, third.value, fourth.value)), cancellationToken);
		second.listen(() => aggregatedSource.update(combinator(this.value, second.value, third.value, fourth.value)), cancellationToken);
		third.listen(() => aggregatedSource.update(combinator(this.value, second.value, third.value, fourth.value)), cancellationToken);
		fourth.listen(() => aggregatedSource.update(combinator(this.value, second.value, third.value, fourth.value)), cancellationToken);

		return aggregatedSource;
	}

	/**
	 * Creates a new datasource that listens to this source and creates a string that contains all the updates with a seperator
	 * @param seperator string to be placed between all the values
	 * @param cancellationToken  Cancellation token to cancel the subscription the new datasource has to this datasource
	 */
	public stringJoin(seperator: string, cancellationToken?: CancellationToken): TransientDataSource<string> {
		cancellationToken = cancellationToken ?? new CancellationToken();
		const joinSource = new TransientDataSource<string>(cancellationToken, '');
		this.listen((v) => joinSource.update(joinSource.value + seperator + v.toString()), cancellationToken);

		return joinSource;
	}

	/**
	 * Like aggregate except that no combination method is needed as a result both parents must have the same type and the new stream just exposes the last update recieved from either parent
	 * @param otherSource Second parent for the new source
	 * @param cancellationToken  Cancellation token to cancel the subscriptions the new datasource has to the two parent datasources
	 */
	public combine(otherSources: DataSource<T>[], cancellationToken?: CancellationToken): TransientDataSource<T> {
		cancellationToken = cancellationToken ?? new CancellationToken();

		const combinedDataSource = new TransientDataSource<T>(cancellationToken);
		this.pipe(combinedDataSource, cancellationToken);
		for (const otherSource of otherSources) {
			otherSource.pipe(combinedDataSource, cancellationToken);
		}

		return combinedDataSource;
	}

	/**
	 * Creates a datasource that forwards all the updates after a certain time has passed, useful to introduce a delay before something triggers. Does not debounce
	 * @param time
	 * @param cancellationToken
	 */
	public delay(time: number, cancellationToken?: CancellationToken): TransientDataSource<T> {
		cancellationToken = cancellationToken ?? new CancellationToken();
		const delayedDataSource = new TransientDataSource<T>(cancellationToken, this.value);

		this.listen((v) => {
			setTimeout(() => {
				delayedDataSource.update(v);
			}, time);
		}, cancellationToken);

		return delayedDataSource;
	}

	/**
	 * Creates a datasource that forwards all the updates after a certain amount of updates have been ignored, Useful to create a stream that ignores some initialization noise
	 * @param amount
	 * @param cancellationToken
	 */
	public skip(amount: number, cancellationToken?: CancellationToken): TransientDataSource<T> {
		cancellationToken = cancellationToken ?? new CancellationToken();
		const delayedDataSource = new TransientDataSource<T>(cancellationToken, this.value);

		this.listen((v) => {
			if (amount === 0) {
				delayedDataSource.update(v);
			} else {
				amount--;
			}
		}, cancellationToken);

		return delayedDataSource;
	}

	/**
	 * Creates a datasource that forwards up to a certain amount of updates, Useful to create a stream that shuts down after a cap has been reached
	 * @param amount
	 * @param cancellationToken
	 */
	public cutoff(amount: number, cancellationToken?: CancellationToken): TransientDataSource<T> {
		cancellationToken = cancellationToken ?? new CancellationToken();
		const delayedDataSource = new TransientDataSource<T>(cancellationToken, this.value);

		this.listen((v) => {
			if (amount-- > 0) {
				delayedDataSource.update(v);
			}
		}, cancellationToken);

		return delayedDataSource;
	}

	/**
	 * Returns a promise that resolves when the next update occurs
	 * @param cancellationToken
	 */
	public awaitNextUpdate(cancellationToken?: CancellationToken): Promise<T> {
		return new Promise((resolve) => {
			this.listenOnce((value) => resolve(value), cancellationToken);
		});
	}

	/**
	 * Creates a new source that listens to the updates of this source and forwards them to itself with a delay, in case many updates happen during this delay only the last update will be taken into account, effectively allowing to skip short lived values. Useful for optimizations
	 * @param time Milliseconds to wait before updating
	 * @param cancellationToken  Cancellation token to cancel the subscription the new datasource has to this datasource
	 */
	public debounce(time: number, cancellationToken?: CancellationToken): TransientDataSource<T> {
		cancellationToken = cancellationToken ?? new CancellationToken();
		const debouncedDataSource = new TransientDataSource<T>(cancellationToken, this.value);
		let timeout;

		this.listen((v) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				debouncedDataSource.update(v);
			}, time);
		}, cancellationToken);

		return debouncedDataSource;
	}

	/**
	 * Creates a new source that listens to the updates of this source and forwards them to itself at most once per <time> milliseconds. In case many updates happen during the delay time only at most one update per delay will be taken into account,
	 * effectively allowing to reduce load on the next stream. Useful for optimizations
	 * @param time Milliseconds of cooldown after an update before another update can happen
	 * @param cancellationToken  Cancellation token to cancel the subscription the new datasource has to this datasource
	 */
	public throttle(time: number, cancellationToken?: CancellationToken): TransientDataSource<T> {
		cancellationToken = cancellationToken ?? new CancellationToken();
		const throttledDataSource = new TransientDataSource<T>(cancellationToken, this.value);
		let cooldown = false;

		this.listen((v) => {
			if (!cooldown) {
				throttledDataSource.update(v);
				cooldown = true;
				setTimeout(() => {
					cooldown = false;
				}, time);
			}
		}, cancellationToken);

		return throttledDataSource;
	}

	/**
	 * Creates a new source that listens to the updates of this source. The updates are collected in an array for a period of time and then the new source updates with an array of all the updates collected in the timespan. Useful to take a rapidly changing source and process it a buffered manner. Can be used for things like batching network requests
	 * @param time Milliseconds to wait before updating the returned source
	 * @param cancellationToken  Cancellation token to cancel the subscription the new datasource has to this datasource
	 */
	public buffer(time: number, cancellationToken?: CancellationToken): TransientDataSource<T[]> {
		cancellationToken = cancellationToken ?? new CancellationToken();
		const bufferedDataSource = new TransientDataSource<T[]>(cancellationToken);
		let timeout;
		let buffer = [];

		this.listen((v) => {
			buffer.push(v);
			if (!timeout) {
				timeout = setTimeout(() => {
					timeout = undefined;
					bufferedDataSource.update(buffer);
					buffer = [];
				}, time);
			}
		}, cancellationToken);

		return bufferedDataSource;
	}

	/**
	 * Creates a new datasource that listens to the updates of this one. The datasource will accumulate all the updates from this source in form of an array data source. Useful to keep a history of all values from a source
	 * @param cancellationToken  Cancellation token to cancel the subscription the new datasource has to this datasource
	 */
	public accumulate(cancellationToken?: CancellationToken): ArrayDataSource<T> {
		const queueDataSource = new ArrayDataSource<T>();

		this.listen((v) => {
			queueDataSource.push(v);
		}, cancellationToken);

		return queueDataSource;
	}

	/**
	 * Creates a new datasource that listens to the updates of this source and forwards only a single key from the object that is held by this data source
	 * @param key key to take from the object
	 * @param cancellationToken  Cancellation token to cancel the subscription the new datasource has to this datasource
	 */
	public pick(key: keyof T, cancellationToken?: CancellationToken): TransientDataSource<T[typeof key]> {
		cancellationToken = cancellationToken ?? new CancellationToken();
		const subDataSource: TransientDataSource<T[typeof key]> = new TransientDataSource(cancellationToken, this.value?.[key]);

		this.listen((v) => {
			if (v !== undefined && v !== null) {
				subDataSource.update(v[key]);
			} else {
				subDataSource.update(v as null | undefined);
			}
		}, cancellationToken);

		return subDataSource;
	}

	/**
	 * Remove all listeners
	 */
	public cancelAll(): void {
		this.updateEvent.cancelAll();
	}
}

/**
 * Same as data source except that once all listeners are gone this stream will self destruct. This prevents memory leaks
 */
export class TransientDataSource<T> extends DataSource<T> {
	private disposeToken: CancellationToken;

	constructor(disposeToken: CancellationToken, initialValue?: T) {
		super(initialValue);
		this.disposeToken = disposeToken;
		this.updateEvent.onEmpty = () => {
			disposeToken.cancel();
			Object.defineProperty(this, 'value', {
				get() {
					throw new Error(
						'Transient data source has expired and can no longer be used if you wish to use it even after all listeners were removed "persist". Note that persisted data sources will not be garabge collected unless you remove the subscription they have on their parent source'
					);
				},
				set() {
					throw new Error(
						'Transient data source has expired and can no longer be used if you wish to use it even after all listeners were removed "persist". Note that persisted data sources will not be garabge collected unless you remove the subscription they have on their parent source'
					);
				}
			});
		};
	}

	/**
	 * Turns the transient data source into a regular data source
	 * @returns self
	 */
	public persist(): this {
		this.updateEvent.onEmpty = undefined;
		return this;
	}

	public listen(callback: Callback<T>, cancellationToken?: CancellationToken): Callback<void> {
		this.disposeToken.throwIfCancelled('Transient data source has expired. Listening not possible');
		return super.listen(callback, cancellationToken);
	}

	public listenAndRepeat(callback: Callback<T>, cancellationToken?: CancellationToken): Callback<void> {
		this.disposeToken.throwIfCancelled('Transient data source has expired. Listening not possible');
		return super.listenAndRepeat(callback, cancellationToken);
	}

	public listenOnce(callback: Callback<T>, cancellationToken?: CancellationToken): Callback<void> {
		this.disposeToken.throwIfCancelled('Transient data source has expired. Listening not possible');
		if (cancellationToken) {
		}
		return super.listen(callback, cancellationToken);
	}
}

export interface CollectionChange<T> {
	operation: 'replace' | 'swap' | 'add' | 'remove' | 'merge';
	operationDetailed: 'replace' | 'append' | 'prepend' | 'removeRight' | 'removeLeft' | 'remove' | 'swap' | 'clear' | 'merge';
	count?: number;
	index: number;
	index2?: number;
	target?: T;
	items: T[];
	newState: T[];
	previousState?: T[];
}
export class ArrayDataSource<T> {
	protected data: T[];
	protected updateEvent: EventEmitter<CollectionChange<T>>;
	private lengthSource: DataSource<number>;

	constructor(initialData?: T[]) {
		if (initialData) {
			this.data = initialData.slice();
		} else {
			this.data = [];
		}
		this.lengthSource = new DataSource(this.data.length);
		this.updateEvent = new EventEmitter();
	}

	/**
	 * Same as listen but will immediately call the callback with an append of all existing elements first
	 */
	public listenAndRepeat(callback: Callback<CollectionChange<T>>, cancellationToken?: CancellationToken): Callback<void> {
		callback({
			operation: 'add',
			operationDetailed: 'append',
			index: 0,
			items: this.data,
			newState: this.data,
			count: this.data.length
		});
		return this.listen(callback, cancellationToken);
	}

	public listen(callback: Callback<CollectionChange<T>>, cancellationToken?: CancellationToken): Callback<void> {
		return this.updateEvent.subscribe(callback, cancellationToken).cancel;
	}

	public listenOnce(callback: Callback<CollectionChange<T>>, cancellationToken?: CancellationToken): Callback<void> {
		return this.updateEvent.subscribeOnce(callback, cancellationToken).cancel;
	}

	/**
	 * Returns a promise that resolves when the next update occurs
	 * @param cancellationToken
	 */
	public awaitNextUpdate(cancellationToken?: CancellationToken): Promise<CollectionChange<T>> {
		return new Promise((resolve) => {
			this.listenOnce((value) => resolve(value), cancellationToken);
		});
	}

	public get length(): DataSource<number> {
		return this.lengthSource;
	}

	public getData(): T[] {
		return this.data.slice();
	}

	public get(index: number): T {
		return this.data[index];
	}

	public set(index: number, item: T): void {
		const old = this.data[index];
		if (old === item) {
			return;
		}
		this.data[index] = item;
		this.update({ operation: 'replace', operationDetailed: 'replace', target: old, count: 1, index, items: [item], newState: this.data });
		if (this.lengthSource.value !== this.data.length) {
			this.lengthSource.update(this.data.length);
		}
	}

	public swap(indexA: number, indexB: number): void {
		if (indexA === indexB) {
			return;
		}

		const itemA = this.data[indexA];
		const itemB = this.data[indexB];
		this.data[indexB] = itemA;
		this.data[indexA] = itemB;

		this.update({ operation: 'swap', operationDetailed: 'swap', index: indexA, index2: indexB, items: [itemA, itemB], newState: this.data });
		if (this.lengthSource.value !== this.data.length) {
			this.lengthSource.update(this.data.length);
		}
	}

	public swapItems(itemA: T, itemB: T): void {
		if (itemA === itemB) {
			return;
		}

		const indexA = this.data.indexOf(itemA);
		const indexB = this.data.indexOf(itemB);
		if (indexA !== -1 && indexB !== -1) {
			this.data[indexB] = itemA;
			this.data[indexA] = itemB;
		}

		this.update({ operation: 'swap', operationDetailed: 'swap', index: indexA, index2: indexB, items: [itemA, itemB], newState: this.data });
		if (this.lengthSource.value !== this.data.length) {
			this.lengthSource.update(this.data.length);
		}
	}

	public appendArray(items: T[]) {
		const old = this.data;
		this.data = new Array(old.length);
		let i = 0;
		for (i = 0; i < old.length; i++) {
			this.data[i] = old[i];
		}

		for (let n = 0; n < items.length; n++) {
			this.data[i + n] = items[n];
		}

		this.update({
			operation: 'add',
			operationDetailed: 'append',
			count: items.length,
			index: this.data.length - items.length,
			items,
			newState: this.data
		});
		if (this.lengthSource.value !== this.data.length) {
			this.lengthSource.update(this.data.length);
		}
	}

	public push(...items: T[]) {
		this.appendArray(items);
	}

	public unshift(...items: T[]) {
		this.data.unshift(...items);
		this.update({ operation: 'add', operationDetailed: 'prepend', count: items.length, items, index: 0, newState: this.data });
		if (this.lengthSource.value !== this.data.length) {
			this.lengthSource.update(this.data.length);
		}
	}

	public pop(): T {
		const item = this.data.pop();

		this.update({
			operation: 'remove',
			operationDetailed: 'removeRight',
			count: 1,
			index: this.data.length,
			items: [item],
			newState: this.data
		});

		if (this.lengthSource.value !== this.data.length) {
			this.lengthSource.update(this.data.length);
		}
		return item;
	}

	public merge(newData: T[]): void {
		const old = this.data;
		this.data = newData.slice();

		this.update({
			operation: 'merge',
			operationDetailed: 'merge',
			previousState: old,
			index: 0,
			items: this.data,
			newState: this.data
		});
		if (this.lengthSource.value !== this.data.length) {
			this.lengthSource.update(this.data.length);
		}
	}

	public removeRight(count: number): void {
		const length = this.data.length;
		const result = this.data.splice(length - count, count);
		this.update({ operation: 'remove', operationDetailed: 'removeRight', count, index: length - count, items: result, newState: this.data });
		if (this.lengthSource.value !== this.data.length) {
			this.lengthSource.update(this.data.length);
		}
	}

	public removeLeft(count: number): void {
		const result = this.data.splice(0, count);
		this.update({ operation: 'remove', operationDetailed: 'removeLeft', count, index: 0, items: result, newState: this.data });
		if (this.lengthSource.value !== this.data.length) {
			this.lengthSource.update(this.data.length);
		}
	}
	public remove(item: T): void {
		const index = this.data.indexOf(item);
		if (index !== -1) {
			this.data.splice(index, 1);
			this.update({ operation: 'remove', operationDetailed: 'remove', count: 1, index, items: [item], newState: this.data });
			if (this.lengthSource.value !== this.data.length) {
				this.lengthSource.update(this.data.length);
			}
		}
	}

	public clear(): void {
		if (this.data.length === 0) {
			return;
		}

		const items = this.data;
		this.data = [];
		this.update({
			operation: 'remove',
			operationDetailed: 'clear',
			count: items.length,
			index: 0,
			items,
			newState: this.data
		});
		if (this.lengthSource.value !== this.data.length) {
			this.lengthSource.update(this.data.length);
		}
	}

	public shift(): T {
		const item = this.data.shift();
		this.update({ operation: 'remove', operationDetailed: 'removeLeft', items: [item], count: 1, index: 0, newState: this.data });
		if (this.lengthSource.value !== this.data.length) {
			this.lengthSource.update(this.data.length);
		}

		return item;
	}

	public toArray(): T[] {
		return this.data.slice();
	}

	public sort(comparator: (a: T, b: T) => number, dependencies: ReadOnlyDataSource<any>[] = [], cancellationToken?: CancellationToken): SortedArrayView<T> {
		const view = new SortedArrayView(this, comparator, cancellationToken);
		dependencies.forEach((dep) => {
			dep.listen(() => view.refresh());
		});

		return view;
	}

	public map<D>(mapper: (data: T) => D, dependencies: ReadOnlyDataSource<any>[] = [], cancellationToken?: CancellationToken): MappedArrayView<T, D> {
		const view = new MappedArrayView<T, D>(this, mapper, cancellationToken);
		dependencies.forEach((dep) => {
			dep.listen(() => view.refresh());
		});

		return view;
	}

	public filter(callback: Predicate<T>, dependencies: ReadOnlyDataSource<any>[] = [], cancellationToken?: CancellationToken): FilteredArrayView<T> {
		const view = new FilteredArrayView(this, callback, cancellationToken);
		dependencies.forEach((dep) => {
			dep.listen(() => view.refresh(), cancellationToken);
		});

		return view;
	}

	public forEach(callbackfn: (value: T, index: number, array: T[]) => void): void {
		return this.data.forEach(callbackfn);
	}

	protected update(change: CollectionChange<T>) {
		this.updateEvent.fire(change);
	}
}

export class TransientArrayDataSource<T> extends ArrayDataSource<T> {
	private disposeToken: CancellationToken;

	constructor(disposeToken: CancellationToken, initialValue?: T[]) {
		super(initialValue);
		this.disposeToken = disposeToken;
		this.updateEvent.onEmpty = () => {
			disposeToken.cancel();
			Object.defineProperty(this, 'data', {
				get() {
					throw new Error(
						'Transient data source has expired and can no longer be used if you wish to use it even after all listeners were removed "persist". Note that persisted data sources will not be garabge collected unless you remove the subscription they have on their parent source'
					);
				},
				set() {
					throw new Error(
						'Transient data source has expired and can no longer be used if you wish to use it even after all listeners were removed "persist". Note that persisted data sources will not be garabge collected unless you remove the subscription they have on their parent source'
					);
				}
			});
		};
	}

	/**
	 * Turns the transient data source into a regular data source
	 * @returns self
	 */
	public persist(): this {
		this.updateEvent.onEmpty = undefined;
		return this;
	}

	public listenAndRepeat(callback: Callback<CollectionChange<T>>, cancellationToken?: CancellationToken): Callback<void> {
		this.disposeToken.throwIfCancelled('Transient data source has expired. Listening not possible');
		return super.listenAndRepeat(callback, cancellationToken);
	}

	public listen(callback: Callback<CollectionChange<T>>, cancellationToken?: CancellationToken): Callback<void> {
		this.disposeToken.throwIfCancelled('Transient data source has expired. Listening not possible');
		return super.listen(callback, cancellationToken);
	}

	public listenOnce(callback: Callback<CollectionChange<T>>, cancellationToken?: CancellationToken): Callback<void> {
		this.disposeToken.throwIfCancelled('Transient data source has expired. Listening not possible');
		return super.listenOnce(callback, cancellationToken);
	}
}

export class MappedArrayView<D, T> extends TransientArrayDataSource<T> {
	private parent: ArrayDataSource<D>;
	private mapper: (a: D) => T;

	constructor(parent: ArrayDataSource<D>, mapper: (a: D) => T, cancellationToken: CancellationToken = new CancellationToken()) {
		const initial = parent.getData().map(mapper);
		super(cancellationToken, initial);
		this.parent = parent;
		this.mapper = mapper;

		parent.listen((change) => {
			switch (change.operationDetailed) {
				case 'removeLeft':
					this.removeLeft(change.count);
					break;
				case 'removeRight':
					this.removeRight(change.count);
					break;
				case 'remove':
					this.remove(this.data[change.index]);
					break;
				case 'clear':
					this.clear();
					break;
				case 'prepend':
					this.unshift(...change.items.map(this.mapper));
					break;
				case 'append':
					this.appendArray(change.items.map(this.mapper));
					break;
				case 'swap':
					this.swap(change.index, change.index2);
					break;
				case 'replace':
					this.set(change.index, this.mapper(change.items[0]));
					break;
				case 'merge':
					const old = this.data.slice();
					const source = change.previousState.slice();
					for (let i = 0; i < change.newState.length; i++) {
						if (this.data.length <= i) {
							this.data.push(this.mapper(change.newState[i]));
						}
						if (source[i] !== change.newState[i]) {
							const index = source.indexOf(change.newState[i]);
							if (index !== -1) {
								const a = this.data[i];
								const b = this.data[index];
								this.data[i] = b;
								this.data[index] = a;
								const c = source[i];
								const d = source[index];
								source[i] = d;
								source[index] = c;
							} else {
								//@ts-ignore
								this.data.splice(i, 0, this.mapper(change.newState[i]));
								source.splice(i, 0, change.newState[i]);
							}
						}
					}
					if (this.data.length > change.newState.length) {
						this.data.length = change.newState.length;
					}
					this.update({
						operation: 'merge',
						operationDetailed: 'merge',
						previousState: old,
						index: 0,
						items: this.data,
						newState: this.data
					});
					break;
			}
		}, cancellationToken);
	}

	public refresh() {
		//@ts-ignore
		this.merge(this.parent.data.map(this.mapper));
	}
}

export class SortedArrayView<T> extends TransientArrayDataSource<T> {
	private comparator: (a: T, b: T) => number;
	private parent: ArrayDataSource<T>;

	constructor(parent: ArrayDataSource<T>, comparator: (a: T, b: T) => number, cancellationToken: CancellationToken = new CancellationToken()) {
		const initial = parent.getData().sort(comparator);
		super(cancellationToken, initial);
		this.parent = parent;
		this.comparator = comparator;

		parent.listen((change) => {
			switch (change.operationDetailed) {
				case 'removeLeft':
				case 'removeRight':
					for (const item of change.items) {
						this.remove(item);
					}
					break;
				case 'remove':
					this.remove(change.items[0]);
					break;
				case 'clear':
					this.clear();
					break;
				case 'prepend':
					this.unshift(...change.items);
					this.data.sort(this.comparator);
					break;
				case 'append':
					this.appendSorted(change.items);
					break;
				case 'merge':
					this.merge(change.items.slice().sort(this.comparator));
					break;
				case 'swap':
					break;
				case 'replace':
					this.remove(change.target);
					this.appendSorted(change.items);
					break;
			}
		}, cancellationToken);
	}

	private appendSorted(items: T[]) {
		this.merge(this.data.concat(items).sort(this.comparator));
	}

	public refresh() {
		this.merge(this.parent.getData().sort(this.comparator));
	}
}

export class FilteredArrayView<T> extends TransientArrayDataSource<T> {
	private viewFilter: Predicate<T>;
	private parent: ArrayDataSource<T>;
	constructor(parent: ArrayDataSource<T> | T[], filter?: Predicate<T>, cancellationToken: CancellationToken = new CancellationToken()) {
		if (Array.isArray(parent)) {
			parent = new ArrayDataSource(parent);
		}
		filter = filter ?? (() => true);
		const initial = (parent as FilteredArrayView<T>).data.filter(filter);
		super(cancellationToken, initial);

		this.parent = parent;
		this.viewFilter = filter;
		parent.listen((change) => {
			let filteredItems;
			switch (change.operationDetailed) {
				case 'clear':
					this.clear();
					break;
				case 'removeLeft':
				case 'removeRight':
				case 'remove':
					for (const item of change.items) {
						this.remove(item);
					}
					break;
				case 'prepend':
					filteredItems = change.items.filter(this.viewFilter);
					this.unshift(...filteredItems);
					break;
				case 'append':
					filteredItems = change.items.filter(this.viewFilter);
					this.appendArray(filteredItems);
					break;
				case 'merge':
					this.merge(change.items.filter(this.viewFilter));
					break;
				case 'swap':
					const indexA = this.data.indexOf(change.items[0]);
					const indexB = this.data.indexOf(change.items[1]);
					if (indexA !== -1 && indexB !== -1) {
						this.swap(indexA, indexB);
					}
					break;
				case 'replace':
					const index = this.data.indexOf(change.target);
					if (index !== -1) {
						const acceptNew = this.viewFilter(change.items[0]);
						if (acceptNew) {
							this.set(index, change.items[0]);
						} else {
							this.remove(change.target);
						}
					}
					break;
			}
		}, cancellationToken);
	}

	/**
	 * Replaces the filter function
	 * @param filter
	 * @returns returns new size of array view after applying filter
	 */
	public updateFilter(filter: Predicate<T>): number {
		if (this.viewFilter === filter) {
			return;
		}
		this.viewFilter = filter;
		this.refresh();
		return this.data.length;
	}

	/**
	 * Recalculates the filter. Only needed if your filter function isn't pure and you know the result would be different if run again compared to before
	 */
	public refresh() {
		this.merge((this.parent as FilteredArrayView<T>).data.filter(this.viewFilter));
	}
}

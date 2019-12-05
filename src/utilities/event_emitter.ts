import { CancellationToken } from '../utilities/cancellation_token';
import { Callback } from './common';

export interface EventSubscriptionFacade {
	cancel(): void;
}

export type EventCallback<T> = (data: T) => void;

interface EventSubscription<T> {
	callback: EventCallback<T>;
}

export class EventEmitter<T> {
	private isFiring: boolean;
	private onAfterFire: Array<() => void>;

	public get subscriptions(): number {
		return this.subscribeChannel.length;
	}

	private subscribeChannel: EventSubscription<T>[];

	constructor() {
		this.subscribeChannel = [];
		this.onAfterFire = [];
	}

	public subscribe(callback: EventCallback<T>, cancellationToken?: CancellationToken): EventSubscriptionFacade {
		const { facade } = this.createSubscription(callback, this.subscribeChannel, cancellationToken);

		return facade;
	}

	public hasSubscriptions(): boolean {
		return this.subscriptions > 0;
	}

	public cancelAll(): void {
		this.subscribeChannel.length = 0;
	}

	public fireFiltered(data: T, filter: Callback<T>): void {
		this.isFiring = true;

		let length = this.subscribeChannel.length;

		for (let i = 0; i < length; i++) {
			if (this.subscribeChannel[i].callback !== filter) {
				this.subscribeChannel[i].callback(data);
			}
		}

		this.isFiring = false;
		this.afterFire();
	}

	private afterFire() {
		if (this.onAfterFire.length > 0) {
			this.onAfterFire.forEach((cb) => cb());
			this.onAfterFire.length = 0;
		}
	}

	public fire(data?: T): void {
		this.isFiring = true;

		let length = this.subscribeChannel.length;

		for (let i = 0; i < length; i++) {
			this.subscribeChannel[i].callback(data);
		}

		this.isFiring = false;
		this.afterFire();
	}

	private createSubscription(
		callback: EventCallback<T>,
		channel: EventSubscription<T>[],
		cancellationToken?: CancellationToken
	): { subscription: EventSubscription<T>; facade: EventSubscriptionFacade } {
		const that: this = this;

		const subscription: EventSubscription<T> = {
			callback
		};

		const facade: EventSubscriptionFacade = {
			cancel() {
				that.cancel(subscription, channel);
			}
		};

		if (cancellationToken !== undefined) {
			cancellationToken.addCancelable(() => that.cancel(subscription, channel));
		}
		channel.push(subscription);

		return { subscription, facade };
	}

	private cancel(subscription: EventSubscription<T>, channel: EventSubscription<T>[]): void {
		let index: number = channel.indexOf(subscription);
		if (index >= 0) {
			if (!this.isFiring) {
				channel.splice(index, 1);
			} else {
				this.onAfterFire.push(() => this.cancel(subscription, channel));
			}
		}
	}
}

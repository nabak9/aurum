import { assert } from 'chai';
import { ArrayDataSource, DataSource, Aurum, CancellationToken } from '../src/aurum';

describe('ArrayDatasource', () => {
	it('should store values', () => {
		let ds = new ArrayDataSource([1, 2, 3]);
		assert.deepEqual(ds.toArray(), [1, 2, 3]);
	});

	it('push', () => {
		let ds = new ArrayDataSource([1, 2, 3]);
		ds.push(4, 5);
		assert.deepEqual(ds.toArray(), [1, 2, 3, 4, 5]);
	});

	it('from multiple', () => {
		const ds1 = new ArrayDataSource();
		const ds2 = new ArrayDataSource();
		const ds3 = new ArrayDataSource();
		const ds4 = new ArrayDataSource();
		let ds = ArrayDataSource.fromMultipleSources(new CancellationToken(), ds1, ds2, [1, 2, 3], ds3, ds4, [1, 2]);

		assert.deepEqual(ds.toArray(), [1, 2, 3, 1, 2]);

		ds3.push(9, 8);
		assert.deepEqual(ds.toArray(), [1, 2, 3, 9, 8, 1, 2]);

		ds1.push(1, 2, 3, 4);
		assert.deepEqual(ds.toArray(), [1, 2, 3, 4, 1, 2, 3, 9, 8, 1, 2]);

		ds1.removeLeft(2);
		assert.deepEqual(ds.toArray(), [3, 4, 1, 2, 3, 9, 8, 1, 2]);

		ds3.clear();
		assert.deepEqual(ds.toArray(), [3, 4, 1, 2, 3, 1, 2]);

		ds4.push(4, 4, 4);
		assert.deepEqual(ds.toArray(), [3, 4, 1, 2, 3, 4, 4, 4, 1, 2]);

		ds2.push(3, 3, 3);
		assert.deepEqual(ds.toArray(), [3, 4, 3, 3, 3, 1, 2, 3, 4, 4, 4, 1, 2]);

		ds2.insertAt(2, 5);
		assert.deepEqual(ds.toArray(), [3, 4, 3, 3, 5, 3, 1, 2, 3, 4, 4, 4, 1, 2]);
	});

	it('reverse', () => {
		const ds = new ArrayDataSource([1, 2, 3, 4, 5, 6]);
		const reverse = ds.reverse();

		assert.deepEqual(reverse.toArray(), [6, 5, 4, 3, 2, 1]);

		ds.push(7);
		assert.deepEqual(reverse.toArray(), [7, 6, 5, 4, 3, 2, 1]);

		ds.push(8, 9);
		assert.deepEqual(reverse.toArray(), [9, 8, 7, 6, 5, 4, 3, 2, 1]);

		ds.insertAt(3, 0);
		assert.deepEqual(reverse.toArray(), [9, 8, 7, 6, 5, 4, 0, 3, 2, 1]);

		ds.removeAt(2);
		assert.deepEqual(reverse.toArray(), [9, 8, 7, 6, 5, 4, 0, 2, 1]);

		ds.removeLeft(2);
		assert.deepEqual(reverse.toArray(), [9, 8, 7, 6, 5, 4, 0]);

		ds.removeRight(2);
		assert.deepEqual(reverse.toArray(), [7, 6, 5, 4, 0]);
	});

	it('merge', () => {
		let ds = new ArrayDataSource([1, 2, 3]);
		ds.merge([6, 7]);
		assert.deepEqual(ds.toArray(), [6, 7]);
		ds.merge([6, 7, 8]);
		assert.deepEqual(ds.toArray(), [6, 7, 8]);
		ds.merge([6, 8, 7]);
		assert.deepEqual(ds.toArray(), [6, 8, 7]);
		ds.merge([5, 6, 8, 7]);
		assert.deepEqual(ds.toArray(), [5, 6, 8, 7]);
		ds.merge([4, 5, 8, 7, 6]);
		assert.deepEqual(ds.toArray(), [4, 5, 8, 7, 6]);
		ds.merge([5, 8, 7, 6, 1]);
		assert.deepEqual(ds.toArray(), [5, 8, 7, 6, 1]);
		ds.merge([2, 4, 6, 8]);
		assert.deepEqual(ds.toArray(), [2, 4, 6, 8]);
		ds.merge([3, 6, 9]);
		assert.deepEqual(ds.toArray(), [3, 6, 9]);
	});

	it('filter + sort', () => {
		const ds = new ArrayDataSource([4, 5, 7, 3, 8, 6, 9, 1, 2]);
		const key = new DataSource(2);
		const reverse = new DataSource<boolean>(false);
		const sorted = ds.filter((v) => v % key.value === 0, [key]).sort((a, b) => (reverse.value ? b - a : a - b), [reverse]);

		assert.deepEqual(sorted.toArray(), [2, 4, 6, 8]);
		key.update(3);
		assert.deepEqual(sorted.toArray(), [3, 6, 9]);
		reverse.update(true);
		assert.deepEqual(sorted.toArray(), [9, 6, 3]);
		key.update(2);
		assert.deepEqual(sorted.toArray(), [8, 6, 4, 2]);
	});

	it('filter + sort + map', () => {
		const ds = new ArrayDataSource([4, 5, 7, 3, 8, 6, 9, 1, 2]);
		const key = new DataSource(2);
		const reverse = new DataSource<boolean>(false);
		const mapped = ds
			.filter((v) => v % key.value === 0, [key])
			.sort((a, b) => (reverse.value ? b - a : a - b), [reverse])
			.map((v) => 'val:' + v);

		assert.deepEqual(mapped.toArray(), ['val:2', 'val:4', 'val:6', 'val:8']);
		key.update(3);
		assert.deepEqual(mapped.toArray(), ['val:3', 'val:6', 'val:9']);
		reverse.update(true);
		assert.deepEqual(mapped.toArray(), ['val:9', 'val:6', 'val:3']);
		key.update(2);
		assert.deepEqual(mapped.toArray(), ['val:8', 'val:6', 'val:4', 'val:2']);
	});

	it('filter + sort + map + render', () => {
		const ds = new ArrayDataSource([4, 5, 7, 3, 8, 6, 9, 1, 2]);
		const key = new DataSource(2);
		const reverse = new DataSource<boolean>(false);
		const mapped = ds
			.filter((v) => v % key.value === 0, [key])
			.sort((a, b) => (reverse.value ? b - a : a - b), [reverse])
			.map((v) => <div>{v}</div>);

		const token = Aurum.attach(<div>{mapped}</div>, document.getElementById('target'));

		assert.deepEqual((document.getElementById('target').firstChild as HTMLDivElement).textContent, '2468');
		key.update(3);
		assert.deepEqual((document.getElementById('target').firstChild as HTMLDivElement).textContent, '369');
		reverse.update(true);
		assert.deepEqual((document.getElementById('target').firstChild as HTMLDivElement).textContent, '963');
		key.update(2);
		assert.deepEqual((document.getElementById('target').firstChild as HTMLDivElement).textContent, '8642');

		token.cancel();
	});

	it('render all types', () => {
		const ads = new ArrayDataSource<any>([4, 5, 7]);
		const ds = new DataSource(2);
		const ads2 = new ArrayDataSource([1, 2, 3]);

		const token = Aurum.attach(<div>{ads}</div>, document.getElementById('target'));

		assert.deepEqual((document.getElementById('target').firstChild as HTMLDivElement).textContent, '457');

		ads.merge([1, 2, 3]);
		assert.deepEqual((document.getElementById('target').firstChild as HTMLDivElement).textContent, '123');

		ads.merge(['0', '0']);
		assert.deepEqual((document.getElementById('target').firstChild as HTMLDivElement).textContent, '00');

		ads.merge([1, '0', 2, 3, '0']);
		assert.deepEqual((document.getElementById('target').firstChild as HTMLDivElement).textContent, '10230');

		ads.merge(['0', '0']);
		assert.deepEqual((document.getElementById('target').firstChild as HTMLDivElement).textContent, '00');

		ads.clear();
		ads.push('0', '0');
		assert.deepEqual((document.getElementById('target').firstChild as HTMLDivElement).textContent, '00');

		ads.push(undefined);
		assert.deepEqual((document.getElementById('target').firstChild as HTMLDivElement).textContent, '00');

		ads.push(3);
		assert.deepEqual((document.getElementById('target').firstChild as HTMLDivElement).textContent, '003');

		ads.push(null);
		assert.deepEqual((document.getElementById('target').firstChild as HTMLDivElement).textContent, '003');

		ads.push(4);
		assert.deepEqual((document.getElementById('target').firstChild as HTMLDivElement).textContent, '0034');

		ads.set(2, 'test');
		assert.deepEqual((document.getElementById('target').firstChild as HTMLDivElement).textContent, '00test34');

		ads.clear();
		assert.deepEqual((document.getElementById('target').firstChild as HTMLDivElement).textContent, '');

		ads.push(ds);
		assert.deepEqual((document.getElementById('target').firstChild as HTMLDivElement).textContent, '2');

		ds.update(3);
		assert.deepEqual((document.getElementById('target').firstChild as HTMLDivElement).textContent, '3');

		ads.push(ads2);
		assert.deepEqual((document.getElementById('target').firstChild as HTMLDivElement).textContent, '3123');

		ads2.push(4);
		assert.deepEqual((document.getElementById('target').firstChild as HTMLDivElement).textContent, '31234');

		ds.update(1);
		assert.deepEqual((document.getElementById('target').firstChild as HTMLDivElement).textContent, '11234');

		ads2.removeLeft(2);
		assert.deepEqual((document.getElementById('target').firstChild as HTMLDivElement).textContent, '134');

		ads.remove(ds);
		assert.deepEqual((document.getElementById('target').firstChild as HTMLDivElement).textContent, '34');

		ads.remove(ads2);
		assert.deepEqual((document.getElementById('target').firstChild as HTMLDivElement).textContent, '');

		token.cancel();
	});
});

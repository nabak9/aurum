import { assert } from 'chai';
import { ArrayDataSource, DataSource, Aurum } from '../src/aurum';

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
		const sorted = ds
			.filter((v) => v % key.value === 0, [key])
			.sort((a, b) => (reverse.value ? b - a : a - b), [reverse])
			.persist();

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
			.map((v) => 'val:' + v)
			.persist();

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
			.map((v) => <div>{v}</div>)
			.persist();

		Aurum.attach(<div>{mapped}</div>, document.body);

		assert.deepEqual((document.body.firstChild as HTMLDivElement).textContent, '2468');
		key.update(3);
		assert.deepEqual((document.body.firstChild as HTMLDivElement).textContent, '369');
		reverse.update(true);
		assert.deepEqual((document.body.firstChild as HTMLDivElement).textContent, '963');
		key.update(2);
		assert.deepEqual((document.body.firstChild as HTMLDivElement).textContent, '8642');
	});
});

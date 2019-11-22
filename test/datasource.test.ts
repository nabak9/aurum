import { assert } from 'chai';
import { DataSource } from '../src/aurumjs';

describe('Datasource', () => {
	it('should allow omitting initial value', () => {
		let ds = new DataSource();
		assert(ds.value === undefined);
	});

	it('should take initial value', () => {
		let ds = new DataSource(123);
		assert(ds.value === 123);
	});

	it('should update value', () => {
		let ds = new DataSource(123);
		assert(ds.value === 123);
		ds.update(321);
		assert(ds.value === 321);
	});

	it('should fire events', () => {
		return new Promise((resolve) => {
			let ds = new DataSource(123);

			assert(ds.value === 123);
			ds.listen((value) => {
				assert(value === 321);
				resolve();
			});
			ds.update(321);
			assert(ds.value === 321);
		});
	});

	it('should cancel events', () => {
		let ds = new DataSource(123);

		assert(ds.value === 123);
		ds.listen((value) => {
			throw new Error('should have been canceled');
		});
		ds.cancelAll();
		ds.update(321);
	});

	it('should filter updates', () => {
		let ds = new DataSource(123);
		let filtered = ds.filter((v) => v > 200);
		assert(filtered.value === undefined);
		ds.update(100);
		assert(filtered.value === undefined);
		ds.update(200);
		assert(filtered.value === undefined);
		ds.update(300);
		assert(filtered.value === 300);
	});

	it('should pipe updates', () => {
		let ds = new DataSource(123);
		let ds2 = new DataSource(10);
		ds.pipe(ds2);
		assert(ds2.value === 10);
		ds.update(100);
		assert(ds2.value === 100);
		ds.update(200);
		assert(ds2.value === 200);
		ds.update(300);
		assert(ds2.value === 300);
	});

	it('should map updates', () => {
		let ds = new DataSource(123);
		let mapped = ds.map((v) => v + 10);
		assert(mapped.value === 133);
		ds.update(100);
		assert(mapped.value === 110);
		ds.update(200);
		assert(mapped.value === 210);
		ds.update(300);
		assert(mapped.value === 310);
	});

	it('should reduce updates', () => {
		let ds = new DataSource(123);
		let reduced = ds.reduce((p, c) => p + c, ds.value);
		assert(reduced.value === 123);
		ds.update(100);
		assert(reduced.value === 223);
		ds.update(200);
		assert(reduced.value === 423);
		ds.update(300);
		assert(reduced.value === 723);
	});

	it('should aggregate updates', () => {
		let ds = new DataSource(1);
		let ds2 = new DataSource(1);
		let aggregated = ds.aggregate(ds2, (valueA, valueB) => valueA + valueB);
		assert(aggregated.value === 2);
		ds.update(100);
		assert(aggregated.value === 101);
		ds2.update(200);
		assert(aggregated.value === 300);
		ds.update(5);
		assert(aggregated.value === 205);
	});

	it('should combine updates', () => {
		let ds = new DataSource(1);
		let ds2 = new DataSource(1);
		let combined = ds.combine(ds2);
		assert(combined.value === undefined);
		ds.update(100);
		assert(combined.value === 100);
		ds2.update(200);
		assert(combined.value === 200);
		ds.update(5);
		assert(combined.value === 5);
	});

	it('should pick keys from object updates', () => {
		let ds = new DataSource({ someKey: 123 });
		let pick = ds.pick('someKey');
		assert(pick.value === 123);
		ds.update({ someKey: 100 });
		assert(pick.value === 100);
		ds.update({ someKey: undefined });
		assert(pick.value === undefined);
		ds.update(null);
		assert(pick.value === null);

		ds = new DataSource();
		pick = ds.pick('someKey');
		assert(pick.value === undefined);
	});

	it('should fire unique events', () => {
		return new Promise((resolve) => {
			let i = 0;
			let asserts = [4, 0, 100, 200];
			let ds = new DataSource(4);

			ds.unique().listen((value) => {
				assert(value === asserts[i++]);
				if ((i = asserts.length - 1)) {
					resolve();
				}
			});
			ds.update(4);
			ds.update(4);
			ds.update(0);
			ds.update(0);
			ds.update(100);
			ds.update(100);
			ds.update(200);
		});
	});
});

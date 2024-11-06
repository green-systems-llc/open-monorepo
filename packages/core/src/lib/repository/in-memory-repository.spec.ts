import { clone } from '../object/clone.function';
import { SortDirection } from '../sort/sort-direction';
import { InMemoryRepository } from './in-memory-repository';

describe('InMemoryRepository', () => {
  describe('when missing id field', () => {
    let repo: InMemoryRepository;

    beforeEach(() => {
      repo = new InMemoryRepository([
        { name: 'John' },
        { name: 'George' },
        { name: 'Sam' },
      ]);
    });

    it(`should create an 'id' field and set it to unique GUIDs`, async () => {
      const result = await repo.findAll();
      const names = result.map((x) => x['name']);
      expect(names).toEqual(['John', 'George', 'Sam']);
    });
  });

  describe('findAll', () => {
    let repo: InMemoryRepository;
    const input = [
      { id: 1, first: 'John', last: 'Jefferson' },
      { id: 2, first: 'George', last: 'Jackson' },
      { id: 3, first: 'Jeff', last: 'Wilson' },
      { id: 4, first: 'Sam', last: 'Albright' },
      { id: 5, first: 'Abby', last: 'Stevenson' },
      { id: 6, first: 'Jeff', last: 'Black' },
      { id: 7, first: 'Steve', last: 'Smith' },
      { id: 8, first: 'Jane', last: 'Doe' },
    ];

    beforeEach(() => {
      const items = clone(input);
      repo = new InMemoryRepository(items);
    });

    describe('with no criteria passed', () => {
      it(`should return all records in the same order`, async () => {
        const result = await repo.findAll();
        expect(result).toEqual(input);
      });
    });

    describe('with `orderBy` option', () => {
      it(`should sort on orderBy fields`, async () => {
        const result = await repo.findAll({ orderBy: ['first'] });
        expect(result).toEqual([
          { id: 5, first: 'Abby', last: 'Stevenson' },
          { id: 2, first: 'George', last: 'Jackson' },
          { id: 8, first: 'Jane', last: 'Doe' },
          { id: 3, first: 'Jeff', last: 'Wilson' },
          { id: 6, first: 'Jeff', last: 'Black' },
          { id: 1, first: 'John', last: 'Jefferson' },
          { id: 4, first: 'Sam', last: 'Albright' },
          { id: 7, first: 'Steve', last: 'Smith' },
        ]);
      });
    });
  });

  describe('find', () => {
    let repo: InMemoryRepository;
    const input = [
      { id: 1, first: 'John', last: 'Jefferson' },
      { id: 2, first: 'George', last: 'Jackson' },
      { id: 3, first: 'Jeff', last: 'Wilson' },
      { id: 4, first: 'Sam', last: 'Albright' },
      { id: 5, first: 'Abby', last: 'Stevenson' },
      { id: 6, first: 'Jeff', last: 'Black' },
      { id: 7, first: 'Steve', last: 'Smith' },
      { id: 8, first: 'Jane', last: 'Doe' },
    ];

    beforeEach(() => {
      const items = clone(input);
      repo = new InMemoryRepository(items);
    });

    describe(`with 'search' option`, () => {
      it(`should search across all fields`, async () => {
        const result = await repo.find({ search: 'jeff' });
        expect(result).toEqual([
          { id: 1, first: 'John', last: 'Jefferson' },
          { id: 3, first: 'Jeff', last: 'Wilson' },
          { id: 6, first: 'Jeff', last: 'Black' },
        ]);
      });

      it(`should allow empty string search value`, async () => {
        const result = await repo.find({ search: '' });
        expect(result).toEqual(input);
      });
    });

    describe(`with 'search' and 'orderBy' option`, () => {
      describe(`when orderBy 'first' field`, () => {
        it(`should sort by 'first' name ascending`, async () => {
          const orderBy = [{ field: 'first' }];
          const result = await repo.find({ search: 'jeff', orderBy });

          expect(result).toEqual([
            { id: 3, first: 'Jeff', last: 'Wilson' },
            { id: 6, first: 'Jeff', last: 'Black' },
            { id: 1, first: 'John', last: 'Jefferson' },
          ]);
        });
      });

      describe(`when orderBy 'first' and 'last' fields`, () => {
        it(`should sort by 'first' then 'last', ascending`, async () => {
          const sortFields = [{ field: 'first' }, { field: 'last' }];
          const result = await repo.find({
            search: 'jeff',
            orderBy: sortFields,
          });

          expect(result).toEqual([
            { id: 6, first: 'Jeff', last: 'Black' },
            { id: 3, first: 'Jeff', last: 'Wilson' },
            { id: 1, first: 'John', last: 'Jefferson' },
          ]);
        });

        it(`should accept fields as string array`, async () => {
          const sortFields = ['first', 'last'];
          const result = await repo.find({
            search: 'jeff',
            orderBy: sortFields,
          });

          expect(result).toEqual([
            { id: 6, first: 'Jeff', last: 'Black' },
            { id: 3, first: 'Jeff', last: 'Wilson' },
            { id: 1, first: 'John', last: 'Jefferson' },
          ]);
        });
      });

      describe(`when orderBy specifies descending 'direction'`, () => {
        it(`should sort descending`, async () => {
          const sortFields = [
            { field: 'id', direction: SortDirection.Descending },
          ];

          const result = await repo.find({
            search: 'jeff',
            orderBy: sortFields,
          });

          expect(result).toEqual([
            { id: 6, first: 'Jeff', last: 'Black' },
            { id: 3, first: 'Jeff', last: 'Wilson' },
            { id: 1, first: 'John', last: 'Jefferson' },
          ]);
        });
      });
    });
  });

  describe('count', () => {
    let repo: InMemoryRepository;
    const input = [
      { id: 1, first: 'John', last: 'Jefferson' },
      { id: 2, first: 'George', last: 'Jackson' },
      { id: 3, first: 'Jeff', last: 'Wilson' },
      { id: 4, first: 'Sam', last: 'Albright' },
      { id: 5, first: 'Abby', last: 'Stevenson' },
      { id: 6, first: 'Jeff', last: 'Black' },
      { id: 7, first: 'Steve', last: 'Smith' },
      { id: 8, first: 'Jane', last: 'Doe' },
    ];

    beforeEach(() => {
      const items = clone(input);
      repo = new InMemoryRepository(items);
    });

    describe(`with 'search' option`, () => {
      it(`should search across all fields`, async () => {
        const result = await repo.count({ search: 'jeff' });
        expect(result).toEqual(3);
      });

      it(`should allow empty string search value`, async () => {
        const result = await repo.count({ search: '' });
        expect(result).toEqual(8);
      });
    });
  });

  describe('countAll', () => {
    let repo: InMemoryRepository;
    const input = [
      { id: 1, first: 'John', last: 'Jefferson' },
      { id: 2, first: 'George', last: 'Jackson' },
      { id: 3, first: 'Jeff', last: 'Wilson' },
      { id: 4, first: 'Sam', last: 'Albright' },
      { id: 5, first: 'Abby', last: 'Stevenson' },
      { id: 6, first: 'Jeff', last: 'Black' },
      { id: 7, first: 'Steve', last: 'Smith' },
      { id: 8, first: 'Jane', last: 'Doe' },
    ];

    beforeEach(() => {
      const items = clone(input);
      repo = new InMemoryRepository(items);
    });

    it(`should return full count`, async () => {
      const result = await repo.countAll();
      expect(result).toEqual(8);
    });
  });

  describe('findOne', () => {
    let repo: InMemoryRepository;
    const input = [
      { id: 1, first: 'John', last: 'Jefferson' },
      { id: 2, first: 'George', last: 'Jackson' },
      { id: 3, first: 'Jeff', last: 'Wilson' },
      { id: 4, first: 'Sam', last: 'Albright' },
      { id: 5, first: 'Abby', last: 'Stevenson' },
      { id: 6, first: 'Jeff', last: 'Black' },
      { id: 7, first: 'Steve', last: 'Smith' },
      { id: 8, first: 'Jane', last: 'Doe' },
    ];

    beforeEach(() => {
      const items = clone(input);
      repo = new InMemoryRepository(items);
    });

    describe(`with 'search' option`, () => {
      it(`should search across all fields`, async () => {
        const result = await repo.findOne({ search: 'jeff' });
        expect(result).toEqual({ id: 1, first: 'John', last: 'Jefferson' });
      });

      it(`should return null when no items found`, async () => {
        const result = await repo.findOne({ search: 'x' });
        expect(result).toBeNull();
      });

      it(`should allow empty string as search input`, async () => {
        const result = await repo.findOne({ search: '' });
        expect(result).toEqual({ id: 1, first: 'John', last: 'Jefferson' });
      });
    });

    describe(`with 'search' and 'orderBy' option`, () => {
      describe(`when orderBy 'first' field`, () => {
        it(`should sort by 'first' name ascending`, async () => {
          const orderBy = [{ field: 'first' }];
          const result = await repo.findOne({ search: 'jeff', orderBy });

          expect(result).toEqual({ id: 3, first: 'Jeff', last: 'Wilson' });
        });
      });

      describe(`when orderBy 'first' and 'last' fields`, () => {
        it(`should sort by 'first' then 'last', ascending`, async () => {
          const sortFields = [{ field: 'first' }, { field: 'last' }];
          const result = await repo.findOne({
            search: 'jeff',
            orderBy: sortFields,
          });

          expect(result).toEqual({ id: 6, first: 'Jeff', last: 'Black' });
        });

        it(`should accept fields as string array`, async () => {
          const sortFields = ['first', 'last'];
          const result = await repo.findOne({
            search: 'jeff',
            orderBy: sortFields,
          });

          expect(result).toEqual({ id: 6, first: 'Jeff', last: 'Black' });
        });
      });

      describe(`when orderBy specifies descending 'direction'`, () => {
        it(`should sort descending`, async () => {
          const sortFields = [
            { field: 'id', direction: SortDirection.Descending },
          ];

          const result = await repo.findOne({
            search: 'jeff',
            orderBy: sortFields,
          });

          expect(result).toEqual({ id: 6, first: 'Jeff', last: 'Black' });
        });
      });
    });
  });

  describe('get', () => {
    let repo: InMemoryRepository<number>;
    const input = [
      { id: 1, first: 'John', last: 'Jefferson' },
      { id: 2, first: 'George', last: 'Jackson' },
      { id: 3, first: 'Jeff', last: 'Wilson' },
      { id: 4, first: 'Sam', last: 'Albright' },
      { id: 5, first: 'Abby', last: 'Stevenson' },
      { id: 6, first: 'Jeff', last: 'Black' },
      { id: 7, first: 'Steve', last: 'Smith' },
      { id: 8, first: 'Jane', last: 'Doe' },
    ];

    beforeEach(() => {
      const items = clone(input);
      repo = new InMemoryRepository<number>(items);
    });

    describe('when items exists', () => {
      it(`should return the items by ID`, async () => {
        const result = await repo.get([2, 4, 6]);
        expect(result).toEqual([
          { id: 2, first: 'George', last: 'Jackson' },
          { id: 4, first: 'Sam', last: 'Albright' },
          { id: 6, first: 'Jeff', last: 'Black' },
        ]);
      });
    });

    describe(`when an item doesn't exist`, () => {
      it(`should throw an error`, async () => {
        expect(async () => {
          await repo.get([2, 99]);
        }).rejects.toThrow(
          new Error(`Unable to find item by [id] matching [99]`)
        );
      });
    });
  });

  describe('getOne', () => {
    let repo: InMemoryRepository<number>;
    const input = [
      { id: 1, first: 'John', last: 'Jefferson' },
      { id: 2, first: 'George', last: 'Jackson' },
      { id: 3, first: 'Jeff', last: 'Wilson' },
      { id: 4, first: 'Sam', last: 'Albright' },
      { id: 5, first: 'Abby', last: 'Stevenson' },
      { id: 6, first: 'Jeff', last: 'Black' },
      { id: 7, first: 'Steve', last: 'Smith' },
      { id: 8, first: 'Jane', last: 'Doe' },
    ];

    beforeEach(() => {
      const items = clone(input);
      repo = new InMemoryRepository<number>(items);
    });

    describe('when items exists', () => {
      it(`should return the items by ID`, async () => {
        const result = await repo.getOne(2);
        expect(result).toEqual({ id: 2, first: 'George', last: 'Jackson' });
      });
    });

    describe(`when an item doesn't exist`, () => {
      it(`should throw an error`, async () => {
        expect(async () => {
          await repo.getOne(99);
        }).rejects.toThrow(
          new Error(`Unable to find item by [id] matching [99]`)
        );
      });
    });
  });

  describe('composite primary keys', () => {
    let repo: InMemoryRepository<[string, string]>;
    const input = [
      { team: 'one', userId: 'a', value: 1 },
      { team: 'one', userId: 'b', value: 2 },
      { team: 'one', userId: 'c', value: 3 },
      { team: 'two', userId: 'a', value: 4 },
      { team: 'two', userId: 'b', value: 5 },
      { team: 'two', userId: 'c', value: 6 },
      { team: 'three', userId: 'a', value: 7 },
    ];

    beforeEach(() => {
      const items = clone(input);
      repo = new InMemoryRepository<[string, string]>(items, [
        'team',
        'userId',
      ]);
    });

    describe('get', () => {
      describe('when items exists', () => {
        it(`should return the items by ID`, async () => {
          const result = await repo.get([
            ['one', 'a'],
            ['one', 'c'],
            ['two', 'b'],
          ]);
          expect(result).toEqual([
            { team: 'one', userId: 'a', value: 1 },
            { team: 'one', userId: 'c', value: 3 },
            { team: 'two', userId: 'b', value: 5 },
          ]);
        });
      });

      describe(`when an item doesn't exist`, () => {
        it(`should throw an error`, async () => {
          expect(async () => {
            await repo.get([
              ['one', 'a'],
              ['one', 'z'],
            ]);
          }).rejects.toThrow(
            new Error(`Unable to find item by [team,userId] matching [one,z]`)
          );
        });
      });
    });

    describe('put', () => {
      describe(`when putting a single record that doesn't exist`, () => {
        it(`should append it to the end`, async () => {
          await repo.put({ team: 'four', userId: 'a', value: 8 });
          expect(repo.items).toEqual([
            { team: 'one', userId: 'a', value: 1 },
            { team: 'one', userId: 'b', value: 2 },
            { team: 'one', userId: 'c', value: 3 },
            { team: 'two', userId: 'a', value: 4 },
            { team: 'two', userId: 'b', value: 5 },
            { team: 'two', userId: 'c', value: 6 },
            { team: 'three', userId: 'a', value: 7 },
            { team: 'four', userId: 'a', value: 8 },
          ]);
        });
      });

      describe(`when putting a single record that does exist`, () => {
        it(`should replace the item`, async () => {
          await repo.put({ team: 'two', userId: 'a', value: 99 });
          expect(repo.items).toEqual([
            { team: 'one', userId: 'a', value: 1 },
            { team: 'one', userId: 'b', value: 2 },
            { team: 'one', userId: 'c', value: 3 },
            { team: 'two', userId: 'a', value: 99 },
            { team: 'two', userId: 'b', value: 5 },
            { team: 'two', userId: 'c', value: 6 },
            { team: 'three', userId: 'a', value: 7 },
          ]);
        });
      });

      describe('when putting multiple records', () => {
        it(`should append/replace accordingly`, async () => {
          await repo.put([
            { team: 'one', userId: 'b', value: 97 },
            { team: 'two', userId: 'a', value: 98 },
            { team: 'four', userId: 'z', value: 99 },
          ]);
          expect(repo.items).toEqual([
            { team: 'one', userId: 'a', value: 1 },
            { team: 'one', userId: 'b', value: 97 },
            { team: 'one', userId: 'c', value: 3 },
            { team: 'two', userId: 'a', value: 98 },
            { team: 'two', userId: 'b', value: 5 },
            { team: 'two', userId: 'c', value: 6 },
            { team: 'three', userId: 'a', value: 7 },
            { team: 'four', userId: 'z', value: 99 },
          ]);
        });
      });
    });

    describe('patch', () => {
      describe(`when patching a single record that doesn't exist`, () => {
        it(`should throw an error`, async () => {
          expect(async () => {
            await repo.patch({ team: 'nine', userId: 'a', value: 4 });
          }).rejects.toThrow();
        });
      });

      describe(`when patching a single record that does exist`, () => {
        it(`should replace the item`, async () => {
          await repo.patch({ team: 'two', userId: 'a', value2: 99 });
          expect(repo.items).toEqual([
            { team: 'one', userId: 'a', value: 1 },
            { team: 'one', userId: 'b', value: 2 },
            { team: 'one', userId: 'c', value: 3 },
            { team: 'two', userId: 'a', value: 4, value2: 99 },
            { team: 'two', userId: 'b', value: 5 },
            { team: 'two', userId: 'c', value: 6 },
            { team: 'three', userId: 'a', value: 7 },
          ]);
        });
      });

      describe('when patching multiple records', () => {
        it(`should patch accordingly`, async () => {
          await repo.patch([
            { team: 'one', userId: 'b', value: 9 },
            { team: 'two', userId: 'b', value2: 99 },
          ]);
          expect(repo.items).toEqual([
            { team: 'one', userId: 'a', value: 1 },
            { team: 'one', userId: 'b', value: 9 },
            { team: 'one', userId: 'c', value: 3 },
            { team: 'two', userId: 'a', value: 4 },
            { team: 'two', userId: 'b', value: 5, value2: 99 },
            { team: 'two', userId: 'c', value: 6 },
            { team: 'three', userId: 'a', value: 7 },
          ]);
        });
      });
    });
  });

  describe('insert', () => {
    let repo: InMemoryRepository;
    const input = [
      { id: '1', value: 'a' },
      { id: '2', value: 'b' },
      { id: '3', value: 'c' },
    ];

    beforeEach(() => {
      const items = clone(input);
      repo = new InMemoryRepository(items);
    });

    describe('when inserting single record', () => {
      it(`should insert the values`, async () => {
        await repo.insert({ id: '4', value: 'd' });
        expect(repo.items).toEqual([
          { id: '1', value: 'a' },
          { id: '2', value: 'b' },
          { id: '3', value: 'c' },
          { id: '4', value: 'd' },
        ]);
      });
    });

    describe('when inserting multiple records', () => {
      it(`should insert the values`, async () => {
        await repo.insert([
          { id: '4', value: 'd' },
          { id: '5', value: 'e' },
        ]);
        expect(repo.items).toEqual([
          { id: '1', value: 'a' },
          { id: '2', value: 'b' },
          { id: '3', value: 'c' },
          { id: '4', value: 'd' },
          { id: '5', value: 'e' },
        ]);
      });
    });
  });

  describe('put', () => {
    let repo: InMemoryRepository;
    const input = [
      { id: '1', value: 'a' },
      { id: '2', value: 'b' },
      { id: '3', value: 'c' },
    ];

    beforeEach(() => {
      const items = clone(input);
      repo = new InMemoryRepository(items);
    });

    describe(`when putting a single record that doesn't exist`, () => {
      it(`should append it to the end`, async () => {
        await repo.put({ id: '4', value: 'd' });
        expect(repo.items).toEqual([
          { id: '1', value: 'a' },
          { id: '2', value: 'b' },
          { id: '3', value: 'c' },
          { id: '4', value: 'd' },
        ]);
      });
    });

    describe(`when putting a single record that does exist`, () => {
      it(`should replace the item`, async () => {
        await repo.put({ id: '2', value: 'z' });
        expect(repo.items).toEqual([
          { id: '1', value: 'a' },
          { id: '2', value: 'z' },
          { id: '3', value: 'c' },
        ]);
      });
    });

    describe('when putting multiple records', () => {
      it(`should append/replace accordingly`, async () => {
        await repo.put([
          { id: '4', value: 'd' },
          { id: '5', value: 'e' },
          { id: '2', value: 'z' },
        ]);
        expect(repo.items).toEqual([
          { id: '1', value: 'a' },
          { id: '2', value: 'z' },
          { id: '3', value: 'c' },
          { id: '4', value: 'd' },
          { id: '5', value: 'e' },
        ]);
      });
    });
  });

  describe('patch', () => {
    let repo: InMemoryRepository;
    const input = [
      { id: '1', value: 'a' },
      { id: '2', value: 'b' },
      { id: '3', value: 'c' },
    ];

    beforeEach(() => {
      const items = clone(input);
      repo = new InMemoryRepository(items);
    });

    describe(`when patching a single record that doesn't exist`, () => {
      it(`should throw an error`, async () => {
        expect(async () => {
          await repo.patch({ id: '99', value: 'z' });
        }).rejects.toThrow();
      });
    });

    describe(`when patching a single record that does exist`, () => {
      it(`should replace the item`, async () => {
        await repo.patch({ id: '2', value2: 'z' });
        expect(repo.items).toEqual([
          { id: '1', value: 'a' },
          { id: '2', value: 'b', value2: 'z' },
          { id: '3', value: 'c' },
        ]);
      });
    });

    describe('when patching multiple records', () => {
      it(`should patch accordingly`, async () => {
        await repo.patch([
          { id: '1', value: 'a', value2: 'z' },
          { id: '3', value: 'x', value2: 'y' },
        ]);
        expect(repo.items).toEqual([
          { id: '1', value: 'a', value2: 'z' },
          { id: '2', value: 'b' },
          { id: '3', value: 'x', value2: 'y' },
        ]);
      });
    });
  });

  describe('remove', () => {
    let repo: InMemoryRepository;
    const input = [
      { id: '1', value: 'a' },
      { id: '2', value: 'b' },
      { id: '3', value: 'c' },
    ];

    beforeEach(() => {
      const items = clone(input);
      repo = new InMemoryRepository(items);
    });

    describe(`when removing a single record that doesn't exist`, () => {
      it(`should not affect the items`, async () => {
        await repo.remove({ id: '4', value: 'd' });
        expect(repo.items).toEqual([
          { id: '1', value: 'a' },
          { id: '2', value: 'b' },
          { id: '3', value: 'c' },
        ]);
      });
    });

    describe(`when removing a single record by ID that doesn't exist`, () => {
      it(`should not affect the items`, async () => {
        await repo.remove('4');
        expect(repo.items).toEqual([
          { id: '1', value: 'a' },
          { id: '2', value: 'b' },
          { id: '3', value: 'c' },
        ]);
      });
    });

    describe(`when removing a single record that does exist`, () => {
      it(`should remove the item`, async () => {
        await repo.remove({ id: '2' });
        expect(repo.items).toEqual([
          { id: '1', value: 'a' },
          { id: '3', value: 'c' },
        ]);
      });
    });

    describe(`when removing a single record by ID that does exist`, () => {
      it(`should remove the item`, async () => {
        await repo.remove('2');
        expect(repo.items).toEqual([
          { id: '1', value: 'a' },
          { id: '3', value: 'c' },
        ]);
      });
    });

    describe('when removing multiple records', () => {
      it(`should remove accordingly`, async () => {
        await repo.remove([{ id: '1' }, { id: '9' }, { id: '3' }]);
        expect(repo.items).toEqual([{ id: '2', value: 'b' }]);
      });
    });

    describe('when removing multiple records by ID', () => {
      it(`should remove accordingly`, async () => {
        await repo.remove(['1', '9', '3']);
        expect(repo.items).toEqual([{ id: '2', value: 'b' }]);
      });
    });
  });
});

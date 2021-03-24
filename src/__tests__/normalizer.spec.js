import _ from 'lodash';
import deepfreeze from 'deep-freeze';
import Normalizer from '../normalizer';

jest.unmock('../normalizer');

describe('Normalizer', () => {
  let normalizer;

  beforeEach(() => {
    normalizer = new Normalizer('ids', 'entities');
  });

  describe('append mode', () => {
    describe('without nested context', () => {
      const previousState = deepfreeze({
        ids: [1, 3],
        entities: {
          1: {
            id: 1,
            value: 'foo',
          },
          3: {
            id: 3,
            value: 'foo',
          },
        },
      });

      it('should add existing elements', () => {
        const newData = [{ id: 1, value: 'bar' }, { id: 3, value: 'bar' }];
        const { ids, entities } = normalizer.append(previousState, newData);

        expect(ids).toEqual([1, 3]);
        expect(entities).toBe(previousState.entities);
      });

      it('should set new elements with one already known', () => {
        const newData = [{ id: 1, value: 'bar' }, { id: 2, value: 'bar' }];
        const { ids, entities } = normalizer.append(previousState, newData);

        expect(ids).toEqual([1, 3, 2]);
        expect(entities).toEqual({
          1: {
            id: 1,
            value: 'foo',
          },
          3: {
            id: 3,
            value: 'foo',
          },
          2: {
            id: 2,
            value: 'bar',
          },
        });
      });

      it('should set new elements', () => {
        const newData = [{ id: 4, value: 'bar' }, { id: 2, value: 'bar' }];
        const { ids, entities } = normalizer.append(previousState, newData);

        expect(ids).toEqual([1, 3, 4, 2]);
        expect(entities).toEqual({
          1: {
            id: 1,
            value: 'foo',
          },
          3: {
            id: 3,
            value: 'foo',
          },
          4: {
            id: 4,
            value: 'bar',
          },
          2: {
            id: 2,
            value: 'bar',
          },
        });
      });
    });

    describe('with array nested context', () => {
      const previousState = deepfreeze({
        ids: {
          a: {
            b: [1, 3],
            c: [3],
          },
          d: {
            e: [3],
          },
        },
        entities: {
          1: {
            id: 1,
            value: 'foo',
          },
          3: {
            id: 3,
            value: 'foo',
          },
        },
      });

      it('should set extising elements', () => {
        const newData = [{ id: 1, value: 'bar' }, { id: 3, value: 'bar' }];
        const { ids, entities } = normalizer.append(normalizer.append(previousState, newData, ['a', 'b']));

        expect(_.get(ids, ['a', 'b'])).toEqual([1, 3]);
        expect(entities).toBe(previousState.entities);
      });

      it('should set new elements with one already known', () => {
        const newData = [{ id: 1, value: 'bar' }, { id: 2, value: 'bar' }];
        const { ids, entities } = normalizer.append(previousState, newData, ['a', 'b']);

        expect(ids).toEqual({
          a: {
            b: [1, 3, 2],
            c: [3],
          },
          d: {
            e: [3],
          },
        });
        expect(entities).toEqual({
          1: {
            id: 1,
            value: 'foo',
          },
          3: {
            id: 3,
            value: 'foo',
          },
          2: {
            id: 2,
            value: 'bar',
          },
        });
      });

      it('should set new elements', () => {
        const newData = [{ id: 4, value: 'bar' }, { id: 2, value: 'bar' }];
        const { ids, entities } = normalizer.append(previousState, newData, ['a', 'b']);

        expect(ids).toEqual({
          a: {
            b: [1, 3, 4, 2],
            c: [3],
          },
          d: {
            e: [3],
          },
        });
        expect(entities).toEqual({
          1: {
            id: 1,
            value: 'foo',
          },
          3: {
            id: 3,
            value: 'foo',
          },
          4: {
            id: 4,
            value: 'bar',
          },
          2: {
            id: 2,
            value: 'bar',
          },
        });
      });
    });

    describe('with string nested context', () => {
      const previousState = deepfreeze({
        ids: {
          a: [1, 3],
          b: [3],
        },
        entities: {
          1: {
            id: 1,
            value: 'foo',
          },
          3: {
            id: 3,
            value: 'foo',
          },
        },
      });

      it('should set extising elements', () => {
        const newData = [{ id: 1, value: 'bar' }, { id: 3, value: 'bar' }];
        const { ids, entities } = normalizer.append(previousState, newData, 'a');

        expect(_.get(ids, ['a'])).toEqual([1, 3]);
        expect(entities).toBe(previousState.entities);
      });

      it('should set new elements with one already known', () => {
        const newData = [{ id: 1, value: 'bar' }, { id: 2, value: 'bar' }];
        const { ids, entities } = normalizer.append(previousState, newData, 'a');

        expect(ids).toEqual({
          a: [1, 3, 2],
          b: [3],
        });
        expect(entities).toEqual({
          1: {
            id: 1,
            value: 'foo',
          },
          3: {
            id: 3,
            value: 'foo',
          },
          2: {
            id: 2,
            value: 'bar',
          },
        });
      });

      it('should set new elements', () => {
        const newData = [{ id: 4, value: 'bar' }, { id: 2, value: 'bar' }];
        const { ids, entities } = normalizer.append(previousState, newData, 'a');

        expect(ids).toEqual({
          a: [1, 3, 4, 2],
          b: [3],
        });
        expect(entities).toEqual({
          1: {
            id: 1,
            value: 'foo',
          },
          3: {
            id: 3,
            value: 'foo',
          },
          4: {
            id: 4,
            value: 'bar',
          },
          2: {
            id: 2,
            value: 'bar',
          },
        });
      });
    });
  });

  describe('set mode', () => {
    describe('without nested context', () => {
      const previousState = deepfreeze({
        ids: [1, 3],
        entities: {
          1: {
            id: 1,
            value: 'foo',
          },
          3: {
            id: 3,
            value: 'foo',
          },
        },
      });

      it('should not add existing elements', () => {
        const newData = [{ id: 1, value: 'bar' }, { id: 3, value: 'bar' }];
        expect(normalizer.set(previousState, newData)).toBe(previousState);
      });

      it('should set new elements with one already known', () => {
        const newData = [{ id: 1, value: 'bar' }, { id: 2, value: 'bar' }];
        const { ids, entities } = normalizer.set(previousState, newData);

        expect(ids).toEqual([1, 2]);
        expect(entities).toEqual({
          1: {
            id: 1,
            value: 'foo',
          },
          3: {
            id: 3,
            value: 'foo',
          },
          2: {
            id: 2,
            value: 'bar',
          },
        });
      });

      it('should set new elements', () => {
        const newData = [{ id: 4, value: 'bar' }, { id: 2, value: 'bar' }];
        const { ids, entities } = normalizer.set(previousState, newData);

        expect(ids).toEqual([4, 2]);
        expect(entities).toEqual({
          1: {
            id: 1,
            value: 'foo',
          },
          3: {
            id: 3,
            value: 'foo',
          },
          4: {
            id: 4,
            value: 'bar',
          },
          2: {
            id: 2,
            value: 'bar',
          },
        });
      });
    });

    describe('with array nested context', () => {
      const previousState = deepfreeze({
        ids: {
          a: {
            b: [1, 3],
            c: [3],
          },
          d: {
            e: [3],
          },
        },
        entities: {
          1: {
            id: 1,
            value: 'foo',
          },
          3: {
            id: 3,
            value: 'foo',
          },
        },
      });

      it('should set extising elements', () => {
        const newData = [{ id: 1, value: 'bar' }, { id: 3, value: 'bar' }];
        expect(normalizer.set(previousState, newData, ['a', 'b'])).toBe(previousState);
      });

      it('should set new elements with one already known', () => {
        const newData = [{ id: 1, value: 'bar' }, { id: 2, value: 'bar' }];
        const { ids, entities } = normalizer.set(previousState, newData, ['a', 'b']);

        expect(ids).toEqual({
          a: {
            b: [1, 2],
            c: [3],
          },
          d: {
            e: [3],
          },
        });
        expect(entities).toEqual({
          1: {
            id: 1,
            value: 'foo',
          },
          3: {
            id: 3,
            value: 'foo',
          },
          2: {
            id: 2,
            value: 'bar',
          },
        });
      });

      it('should set new elements', () => {
        const newData = [{ id: 4, value: 'bar' }, { id: 2, value: 'bar' }];
        const { ids, entities } = normalizer.set(previousState, newData, ['a', 'b']);

        expect(ids).toEqual({
          a: {
            b: [4, 2],
            c: [3],
          },
          d: {
            e: [3],
          },
        });
        expect(entities).toEqual({
          1: {
            id: 1,
            value: 'foo',
          },
          3: {
            id: 3,
            value: 'foo',
          },
          4: {
            id: 4,
            value: 'bar',
          },
          2: {
            id: 2,
            value: 'bar',
          },
        });
      });
    });

    describe('with string nested context', () => {
      const previousState = deepfreeze({
        ids: {
          a: [1, 3],
          b: [3],
        },
        entities: {
          1: {
            id: 1,
            value: 'foo',
          },
          3: {
            id: 3,
            value: 'foo',
          },
        },
      });

      it('should set extising elements', () => {
        const newData = [{ id: 1, value: 'bar' }, { id: 3, value: 'bar' }];
        expect(normalizer.set(previousState, newData, 'a')).toBe(previousState);
      });

      it('should set new elements with one already known', () => {
        const newData = [{ id: 1, value: 'bar' }, { id: 2, value: 'bar' }];
        const { ids, entities } = normalizer.set(previousState, newData, 'a');

        expect(ids).toEqual({
          a: [1, 2],
          b: [3],
        });
        expect(entities).toEqual({
          1: {
            id: 1,
            value: 'foo',
          },
          3: {
            id: 3,
            value: 'foo',
          },
          2: {
            id: 2,
            value: 'bar',
          },
        });
      });

      it('should set new elements', () => {
        const newData = [{ id: 4, value: 'bar' }, { id: 2, value: 'bar' }];
        const { ids, entities } = normalizer.set(previousState, newData, 'a');

        expect(ids).toEqual({
          a: [4, 2],
          b: [3],
        });
        expect(entities).toEqual({
          1: {
            id: 1,
            value: 'foo',
          },
          3: {
            id: 3,
            value: 'foo',
          },
          4: {
            id: 4,
            value: 'bar',
          },
          2: {
            id: 2,
            value: 'bar',
          },
        });
      });
    });
  });

  describe('set key', () => {
    beforeEach(() => {
      normalizer.shouldElementBeUpdated((element, newElement) => element.extra.key !== newElement.extra.key);
    });

    const previousState = deepfreeze({
      ids: [1, 3],
      entities: {
        1: { id: 1, value: 'foo', extra: { key: 1 } },
        3: { id: 3, value: 'foo', extra: { key: 2 } },
      },
    });

    const newData = [{ id: 1, value: 'foo', extra: { key: 2 } }, { id: 3, value: 'foo', extra: { key: 2 } }];

    it('should set element', () => {
      const { ids, entities } = normalizer.set(previousState, newData);

      expect(ids).toEqual([1, 3]);
      expect(entities).toEqual({
        1: { id: 1, value: 'foo', extra: { key: 2 } },
        3: { id: 3, value: 'foo', extra: { key: 2 } },
      });
    });

    it('should append element', () => {
      const { ids, entities } = normalizer.append(previousState, newData);

      expect(ids).toEqual([1, 3]);
      expect(entities).toEqual({
        1: { id: 1, value: 'foo', extra: { key: 2 } },
        3: { id: 3, value: 'foo', extra: { key: 2 } },
      });
    });
  });
});

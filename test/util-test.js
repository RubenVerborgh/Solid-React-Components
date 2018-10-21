import { domProps } from '../src/util';

describe('util', () => {
  describe('domProps', () => {
    describe('filtering an object', () => {
      const props = {
        foo: 'value',
        bar: 'other',
        bAz: 'another',
        className: 'foo',
        other: true,
      };
      const clone = Object.assign({}, props);
      const result = domProps(props);

      it('does not change the input', () => {
        expect(props).toEqual(clone);
      });

      it('filters properties that are not allowed in the DOM', () => {
        expect(result).toEqual({
          foo: 'value',
          bar: 'other',
          className: 'foo',
        });
      });
    });

    describe('called without arguments', () => {
      it('returns the empty object', () => {
        expect(domProps()).toEqual({});
      });
    });
  });
});

import { resolveLDflex, domProps } from '../src/util';
import * as data from '@solid/query-ldflex';

describe('util', () => {
  describe('resolveLDflex', () => {
    it('evaluates expressions on the @solid/query-ldflex root path', () => {
      data.foo = { bar: 'value' };
      expect(resolveLDflex('foo.bar')).toEqual('value');
    });

    it('errors on invalid expressions', () => {
      expect(() => resolveLDflex('.foo.bar'))
        .toThrow('Expression ".foo.bar" is invalid: Unexpected token .');
    });
  });

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

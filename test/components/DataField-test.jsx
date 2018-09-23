import React from 'react';
import { DataField } from '../../src/';
import { shallow } from 'enzyme';

describe('A DataField', () => {
  describe('without expression', () => {
    let field;
    beforeEach(() => {
      field = shallow(<DataField/>);
    });

    it('is an empty span', () => {
      expect(field.name()).toBe('span');
      expect(field.text()).toBe('');
    });

    it('has the solid class', () => {
      expect(field.hasClass('solid')).toBe(true);
    });

    it('has the data class', () => {
      expect(field.hasClass('data')).toBe(true);
    });

    it('has the empty class', () => {
      expect(field.hasClass('empty')).toBe(true);
    });
  });

  describe('with a data property', () => {
    let field, expression;
    beforeEach(() => {
      expression = { then: jest.fn() };
      field = shallow(<DataField data={expression}/>);
    });

    describe('before the expression resolves', () => {
      it('is an empty span', () => {
        expect(field.name()).toBe('span');
        expect(field.text()).toBe('');
      });

      it('has the solid class', () => {
        expect(field.hasClass('solid')).toBe(true);
      });

      it('has the data class', () => {
        expect(field.hasClass('data')).toBe(true);
      });

      it('has the empty class', () => {
        expect(field.hasClass('empty')).toBe(true);
      });

      it('starts resolving the expression', () => {
        expect(expression.then).toBeCalledTimes(1);
      });
    });

    describe('after the expression resolves', () => {
      beforeEach(() => {
        const resolve = expression.then.mock.calls[0][0];
        resolve({ toString: () => 'contents' });
      });

      it('contains the resolved contents', () => {
        expect(field.text()).toBe('contents');
      });
    });

    describe('after the expression errors', () => {
      beforeEach(() => {
        const reject = expression.then.mock.calls[0][1];
        reject(new Error('the error message'));
      });

      it('is an empty span', () => {
        expect(field.name()).toBe('span');
        expect(field.text()).toBe('');
      });

      it('has the error message in the error property', () => {
        expect(field.prop('error')).toBe('the error message');
      });

      it('has the solid class', () => {
        expect(field.hasClass('solid')).toBe(true);
      });

      it('has the data class', () => {
        expect(field.hasClass('data')).toBe(true);
      });

      it('has the error class', () => {
        expect(field.hasClass('error')).toBe(true);
      });
    });

    describe('after the data changes', () => {
      let newExpression;
      beforeEach(done => {
        newExpression = { then: jest.fn() };
        field.setProps({ data: newExpression }, done);
      });

      describe('before the expression resolves', () => {
        it('starts resolving the expression', () => {
          expect(newExpression.then).toBeCalledTimes(1);
        });
      });

      describe('after the expression resolves', () => {
        beforeEach(() => {
          const resolve = newExpression.then.mock.calls[0][0];
          resolve('new contents');
        });

        it('contains the resolved contents', () => {
          expect(field.text()).toBe('new contents');
        });
      });
    });
  });
});

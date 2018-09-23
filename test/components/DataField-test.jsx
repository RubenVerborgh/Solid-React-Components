import React from 'react';
import { DataField } from '../../src/';
import { shallow } from 'enzyme';
import * as ldflex from '@solid/query-ldflex';

jest.setMock('@solid/query-ldflex', {});

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

    it('has the error message in the error property', () => {
      expect(field.prop('error'))
        .toBe('Expected data to be a path or a string but got undefined');
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

  describe('with data set to a thenable', () => {
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

  describe('with data set to an expression string', () => {
    let field;
    beforeEach(() => {
      ldflex.user = { firstName: { then: jest.fn() } };
      field = shallow(<DataField data="user.firstName"/>);
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
        expect(ldflex.user.firstName.then).toBeCalledTimes(1);
      });
    });

    describe('after the expression resolves', () => {
      beforeEach(() => {
        const resolve = ldflex.user.firstName.then.mock.calls[0][0];
        resolve({ toString: () => 'First' });
      });

      it('resolves to the evaluated expression', () => {
        expect(field.text()).toBe('First');
      });
    });

    describe('after the expression errors', () => {
      beforeEach(() => {
        const reject = ldflex.user.firstName.then.mock.calls[0][1];
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
  });

  describe('with data set to an invalid expression string', () => {
    let field;
    beforeEach(() => {
      field = shallow(<DataField data=".invalid"/>);
    });

    it('is an empty span', () => {
      expect(field.name()).toBe('span');
      expect(field.text()).toBe('');
    });

    it('has the error message in the error property', () => {
      expect(field.prop('error'))
        .toBe('Expression ".invalid" is invalid: Unexpected token .');
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

  describe('with data set to a non-thenable', () => {
    let field;
    beforeEach(() => {
      field = shallow(<DataField data={{}}/>);
    });

    it('is an empty span', () => {
      expect(field.name()).toBe('span');
      expect(field.text()).toBe('');
    });

    it('has the error message in the error property', () => {
      expect(field.prop('error'))
        .toBe('Expected data to be a path or a string but got [object Object]');
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
});

import React from 'react';
import { DataField } from '../../src/';
import { mount } from 'enzyme';
import * as ldflex from '@solid/query-ldflex';
import auth from 'solid-auth-client';

jest.mock('solid-auth-client');
jest.setMock('@solid/query-ldflex', {});

describe('A DataField', () => {
  describe('without expression', () => {
    let field;
    beforeEach(() => {
      field = mount(<DataField/>);
    });
    const span = () => field.find('span').first();

    it('is an empty span', () => {
      expect(span().name()).toBe('span');
      expect(span().text()).toBe('');
    });

    it('has the error message in the error property', () => {
      expect(span().prop('error'))
        .toBe('Expected data to be a path or a string but got undefined');
    });

    it('has the solid class', () => {
      expect(span().hasClass('solid')).toBe(true);
    });

    it('has the data class', () => {
      expect(span().hasClass('data')).toBe(true);
    });

    it('has the error class', () => {
      expect(span().hasClass('error')).toBe(true);
    });
  });

  describe('with data set to a thenable', () => {
    let field, expression, setSession;
    beforeEach(() => {
      expression = { then: jest.fn() };
      field = mount(<DataField data={expression}/>);
      auth.trackSession.mockImplementationOnce(cb => {
        setSession = cb;
        setSession(null);
      });
    });
    const span = () => field.find('span').first();

    describe('before the expression resolves', () => {
      it('is an empty span', () => {
        expect(span().name()).toBe('span');
        expect(span().text()).toBe('');
      });

      it('has the solid class', () => {
        expect(span().hasClass('solid')).toBe(true);
      });

      it('has the data class', () => {
        expect(span().hasClass('data')).toBe(true);
      });

      it('has the empty class', () => {
        expect(span().hasClass('empty')).toBe(true);
      });

      it('starts resolving the expression', () => {
        expect(expression.then).toBeCalledTimes(1);
      });
    });

    describe('after the expression resolves', () => {
      beforeEach(done => {
        const resolve = expression.then.mock.calls[0][0];
        resolve({ toString: () => 'contents' });
        setImmediate(() => field.update());
        setImmediate(done);
      });

      it('contains the resolved contents', () => {
        expect(field.text()).toBe('contents');
      });
    });

    describe('after the expression errors', () => {
      beforeEach(done => {
        const reject = expression.then.mock.calls[0][1];
        reject(new Error('the error message'));
        setImmediate(() => field.update());
        setImmediate(done);
      });

      it('is an empty span', () => {
        expect(span().name()).toBe('span');
        expect(span().text()).toBe('');
      });

      it('has the error message in the error property', () => {
        expect(span().prop('error')).toBe('the error message');
      });

      it('has the solid class', () => {
        expect(span().hasClass('solid')).toBe(true);
      });

      it('has the data class', () => {
        expect(span().hasClass('data')).toBe(true);
      });

      it('has the error class', () => {
        expect(span().hasClass('error')).toBe(true);
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

    describe('after the user changes', () => {
      beforeEach(() => {
        setSession({ webId: 'https://example.org/#me' });
      });

      it('does not re-evaluate the expression', () => {
        expect(expression.then).toBeCalledTimes(1);
      });
    });
  });

  describe('with data set to an expression string', () => {
    let field, setSession;
    beforeEach(() => {
      ldflex.user = { firstName: { then: jest.fn() } };
      field = mount(<DataField data="user.firstName"/>);
      auth.trackSession.mockImplementationOnce(cb => {
        setSession = cb;
        setSession(null);
      });
    });
    const span = () => field.find('span').first();

    describe('before the expression resolves', () => {
      it('is an empty span', () => {
        expect(span().name()).toBe('span');
        expect(span().text()).toBe('');
      });

      it('has the solid class', () => {
        expect(span().hasClass('solid')).toBe(true);
      });

      it('has the data class', () => {
        expect(span().hasClass('data')).toBe(true);
      });

      it('has the empty class', () => {
        expect(span().hasClass('empty')).toBe(true);
      });

      it('starts resolving the expression', () => {
        expect(ldflex.user.firstName.then).toBeCalledTimes(1);
      });
    });

    describe('after the expression resolves', () => {
      beforeEach(done => {
        const resolve = ldflex.user.firstName.then.mock.calls[0][0];
        resolve({ toString: () => 'First' });
        setImmediate(() => field.update());
        setImmediate(done);
      });

      it('resolves to the evaluated expression', () => {
        expect(field.text()).toBe('First');
      });
    });

    describe('after the expression errors', () => {
      beforeEach(done => {
        const reject = ldflex.user.firstName.then.mock.calls[0][1];
        reject(new Error('the error message'));
        setImmediate(() => field.update());
        setImmediate(done);
      });

      it('is an empty span', () => {
        expect(span().name()).toBe('span');
        expect(span().text()).toBe('');
      });

      it('has the error message in the error property', () => {
        expect(span().prop('error')).toBe('the error message');
      });

      it('has the solid class', () => {
        expect(span().hasClass('solid')).toBe(true);
      });

      it('has the data class', () => {
        expect(span().hasClass('data')).toBe(true);
      });

      it('has the error class', () => {
        expect(span().hasClass('error')).toBe(true);
      });
    });

    describe('after the user changes', () => {
      beforeEach(() => {
        setSession({ webId: 'https://example.org/#me' });
      });

      it('is an empty span', () => {
        expect(span().name()).toBe('span');
        expect(span().text()).toBe('');
      });

      it('has the solid class', () => {
        expect(span().hasClass('solid')).toBe(true);
      });

      it('has the data class', () => {
        expect(span().hasClass('data')).toBe(true);
      });

      it('has the empty class', () => {
        expect(span().hasClass('empty')).toBe(true);
      });

      it('re-evaluates the expression', () => {
        expect(ldflex.user.firstName.then).toBeCalledTimes(2);
      });

      describe('after the expression resolves', () => {
        beforeEach(done => {
          const resolve = ldflex.user.firstName.then.mock.calls[1][0];
          resolve({ toString: () => 'Second' });
          setImmediate(() => field.update());
          setImmediate(done);
        });

        it('resolves to the evaluated expression', () => {
          expect(field.text()).toBe('Second');
        });
      });
    });
  });

  describe('with data set to an invalid expression string', () => {
    let field;
    beforeEach(() => {
      field = mount(<DataField data=".invalid"/>);
    });
    const span = () => field.find('span').first();

    it('is an empty span', () => {
      expect(span().name()).toBe('span');
      expect(span().text()).toBe('');
    });

    it('has the error message in the error property', () => {
      expect(span().prop('error'))
        .toBe('Expression ".invalid" is invalid: Unexpected token .');
    });

    it('has the solid class', () => {
      expect(span().hasClass('solid')).toBe(true);
    });

    it('has the data class', () => {
      expect(span().hasClass('data')).toBe(true);
    });

    it('has the error class', () => {
      expect(span().hasClass('error')).toBe(true);
    });
  });

  describe('with data set to a non-thenable', () => {
    let field;
    beforeEach(() => {
      field = mount(<DataField data={{}}/>);
    });
    const span = () => field.find('span').first();

    it('is an empty span', () => {
      expect(span().name()).toBe('span');
      expect(span().text()).toBe('');
    });

    it('has the error message in the error property', () => {
      expect(span().prop('error'))
        .toBe('Expected data to be a path or a string but got [object Object]');
    });

    it('has the solid class', () => {
      expect(span().hasClass('solid')).toBe(true);
    });

    it('has the data class', () => {
      expect(span().hasClass('data')).toBe(true);
    });

    it('has the error class', () => {
      expect(span().hasClass('error')).toBe(true);
    });
  });
});

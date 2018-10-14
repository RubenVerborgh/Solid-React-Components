import React from 'react';
import { resolveExpressions } from '../../src/';
import { mount } from 'enzyme';
import * as ldflex from '@solid/query-ldflex';
import auth from 'solid-auth-client';

jest.mock('solid-auth-client');
jest.setMock('@solid/query-ldflex', {});

describe('A resolveExpressions wrapper', () => {
  const Wrapper = resolveExpressions(['foo', 'bar'], () => <span>contents</span>);
  let wrapper, setSession;

  const expression = { then: jest.fn() };
  ldflex.user = { bar: { then: jest.fn() } };

  beforeEach(() => {
    auth.trackSession.mockImplementationOnce(cb => (setSession = cb));
    wrapper = mount(<Wrapper foo={expression} bar="user.bar" other="value" />);
  });
  const wrapped = () => wrapper.childAt(0).childAt(0);

  it('renders the wrapped component', () => {
    expect(wrapper.html()).toBe('<span>contents</span>');
  });

  describe('before properties are resolved', () => {
    it('passes the first property as undefined', () => {
      expect(wrapped().props()).toHaveProperty('foo', undefined);
    });

    it('passes the second property as undefined', () => {
      expect(wrapped().props()).toHaveProperty('bar', undefined);
    });

    it('sets pending to true', () => {
      expect(wrapped().props()).toHaveProperty('pending', true);
    });

    it('sets error to undefined', () => {
      expect(wrapped().props()).toHaveProperty('error', undefined);
    });

    it('passes other properties to the wrapped component', () => {
      expect(wrapped().props()).toHaveProperty('other', 'value');
    });
  });

  describe('after the first property resolves', () => {
    beforeEach(done => {
      const resolve = expression.then.mock.calls[0][0];
      resolve('first');
      setImmediate(() => wrapper.update());
      setImmediate(done);
    });

    it('passes the first property value', () => {
      expect(wrapped().props()).toHaveProperty('foo', 'first');
    });

    it('passes the second property as undefined', () => {
      expect(wrapped().props()).toHaveProperty('bar', undefined);
    });

    it('sets pending to true', () => {
      expect(wrapped().props()).toHaveProperty('pending', true);
    });

    it('starts resolving the first property', () => {
      expect(expression.then).toHaveBeenCalledTimes(1);
    });

    it('starts resolving the second property', () => {
      expect(ldflex.user.bar.then).toHaveBeenCalledTimes(1);
    });
  });

  describe('after the first property errors', () => {
    beforeEach(done => {
      const reject = expression.then.mock.calls[0][1];
      reject(new Error('error'));
      setImmediate(() => wrapper.update());
      setImmediate(done);
    });

    it('passes the first property as undefined', () => {
      expect(wrapped().props()).toHaveProperty('foo', undefined);
    });

    it('passes the second property as undefined', () => {
      expect(wrapped().props()).toHaveProperty('bar', undefined);
    });

    it('sets pending to false', () => {
      expect(wrapped().props()).toHaveProperty('pending', false);
    });

    it('sets the error', () => {
      expect(wrapped().props()).toHaveProperty('error', new Error('error'));
    });
  });

  describe('after the second property resolves', () => {
    beforeEach(done => {
      const resolve = ldflex.user.bar.then.mock.calls[0][0];
      resolve('second');
      setImmediate(() => wrapper.update());
      setImmediate(done);
    });

    it('passes the first property as undefined', () => {
      expect(wrapped().props()).toHaveProperty('foo', undefined);
    });

    it('passes the second property value', () => {
      expect(wrapped().props()).toHaveProperty('bar', 'second');
    });

    it('sets pending to true', () => {
      expect(wrapped().props()).toHaveProperty('pending', true);
    });
  });

  describe('after the second property errors', () => {
    beforeEach(done => {
      const reject = ldflex.user.bar.then.mock.calls[0][1];
      reject(new Error('error'));
      setImmediate(() => wrapper.update());
      setImmediate(done);
    });

    it('passes the first property as undefined', () => {
      expect(wrapped().props()).toHaveProperty('foo', undefined);
    });

    it('passes the second property as undefined', () => {
      expect(wrapped().props()).toHaveProperty('bar', undefined);
    });

    it('sets pending to false', () => {
      expect(wrapped().props()).toHaveProperty('pending', false);
    });

    it('sets the error', () => {
      expect(wrapped().props()).toHaveProperty('error', new Error('error'));
    });
  });

  describe('after both properties resolve', () => {
    beforeEach(done => {
      const resolve1 = expression.then.mock.calls[0][0];
      const resolve2 = ldflex.user.bar.then.mock.calls[0][0];
      resolve1('first');
      resolve2('second');
      setImmediate(() => wrapper.update());
      setImmediate(done);
    });

    it('passes the first property value', () => {
      expect(wrapped().props()).toHaveProperty('foo', 'first');
    });

    it('passes the second property value', () => {
      expect(wrapped().props()).toHaveProperty('bar', 'second');
    });

    it('sets pending to false', () => {
      expect(wrapped().props()).toHaveProperty('pending', false);
    });
  });

  describe('after the user changes', () => {
    beforeEach(done => {
      setSession({ webId: 'https://example.org/#me' });
      setImmediate(done);
    });

    it('passes the first property as undefined', () => {
      expect(wrapped().props()).toHaveProperty('foo', undefined);
    });

    it('passes the second property as undefined', () => {
      expect(wrapped().props()).toHaveProperty('bar', undefined);
    });

    it('sets pending to true', () => {
      expect(wrapped().props()).toHaveProperty('pending', true);
    });

    it('re-evaluates the first expression', () => {
      expect(expression.then).toBeCalledTimes(2);
    });

    it('re-evaluates the second expression', () => {
      expect(ldflex.user.bar.then).toBeCalledTimes(2);
    });

    describe('after both properties resolve', () => {
      beforeEach(done => {
        const resolve1 = expression.then.mock.calls[1][0];
        const resolve2 = ldflex.user.bar.then.mock.calls[1][0];
        resolve1('first change');
        resolve2('second change');
        setImmediate(() => wrapper.update());
        setImmediate(done);
      });

      it('passes the first property value', () => {
        expect(wrapped().props()).toHaveProperty('foo', 'first change');
      });

      it('passes the second property value', () => {
        expect(wrapped().props()).toHaveProperty('bar', 'second change');
      });

      it('sets pending to false', () => {
        expect(wrapped().props()).toHaveProperty('pending', false);
      });
    });
  });
});

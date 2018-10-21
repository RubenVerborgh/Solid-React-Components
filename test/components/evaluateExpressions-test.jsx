import React from 'react';
import { evaluateExpressions } from '../../src/';
import { mount, render } from 'enzyme';
import { mockPromise, update, setProps } from '../util';
import data from '@solid/query-ldflex';
import auth from 'solid-auth-client';

describe('An evaluateExpressions wrapper', () => {
  const Wrapper = evaluateExpressions(['foo', 'bar'], () => <span>contents</span>);
  let wrapper, foo, bar;

  beforeEach(() => {
    foo = mockPromise();
    bar = mockPromise();
    auth.mockWebId(null);
    data.resolve.mockReturnValue(bar);
    wrapper = mount(<Wrapper foo={foo} bar="user.bar" other="value" />);
  });
  afterEach(() => wrapper.unmount());
  const wrapped = () => wrapper.childAt(0).childAt(0);

  it('renders the wrapped component', () => {
    expect(wrapper.html()).toBe('<span>contents</span>');
  });

  it('accepts null as valueProps and listProps', () => {
    const Component = evaluateExpressions(null, null, () => null);
    render(<Component/>);
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

    it('resolves the string expression', () => {
      expect(data.resolve).toHaveBeenCalledTimes(1);
      expect(data.resolve).toHaveBeenLastCalledWith('user.bar');
    });

    describe('after the second property changes', () => {
      let newBar;
      beforeEach(async () => {
        newBar = mockPromise();
        data.resolve.mockReturnValue(newBar);
        await setProps(wrapper, { bar: 'user.newBar' });
        await update(wrapper);
      });

      it('passes the second property as undefined', () => {
        expect(wrapped().props()).toHaveProperty('bar', undefined);
      });

      it('resolves the string expression', () => {
        expect(data.resolve).toHaveBeenLastCalledWith('user.newBar');
      });

      describe('after the original second property resolves', () => {
        beforeEach(async () => {
          await bar.resolve('second');
          wrapper.update();
        });

        it('passes the second property as undefined', () => {
          expect(wrapped().props()).toHaveProperty('bar', undefined);
        });

        it('sets pending to true', () => {
          expect(wrapped().props()).toHaveProperty('pending', true);
        });
      });

      describe('after the new second property resolves', () => {
        beforeEach(async () => {
          await newBar.resolve('new second');
          wrapper.update();
        });

        it('still has the new second property value', () => {
          expect(wrapped().props()).toHaveProperty('bar', 'new second');
        });

        it('sets pending to true', () => {
          expect(wrapped().props()).toHaveProperty('pending', true);
        });
      });
    });
  });

  describe('after the first property resolves', () => {
    beforeEach(async () => {
      await foo.resolve('first');
      wrapper.update();
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
      expect(foo.then).toHaveBeenCalledTimes(1);
    });

    it('starts resolving the second property', () => {
      expect(bar.then).toHaveBeenCalledTimes(1);
    });

    describe('after the second property changes', () => {
      let newBar;
      beforeEach(async () => {
        newBar = mockPromise();
        data.resolve.mockReturnValue(newBar);
        await setProps(wrapper, { bar: 'user.newBar' });
        await update(wrapper);
      });

      it('passes the second property as undefined', () => {
        expect(wrapped().props()).toHaveProperty('bar', undefined);
      });

      it('resolves the string expression', () => {
        expect(data.resolve).toHaveBeenLastCalledWith('user.newBar');
      });

      describe('after the original second property resolves', () => {
        beforeEach(async () => {
          await bar.resolve('second');
          wrapper.update();
        });

        it('passes the second property as undefined', () => {
          expect(wrapped().props()).toHaveProperty('bar', undefined);
        });

        it('sets pending to true', () => {
          expect(wrapped().props()).toHaveProperty('pending', true);
        });
      });

      describe('after the new second property resolves', () => {
        beforeEach(async () => {
          await newBar.resolve('new second');
          wrapper.update();
        });

        it('still has the new second property value', () => {
          expect(wrapped().props()).toHaveProperty('bar', 'new second');
        });

        it('sets pending to false', () => {
          expect(wrapped().props()).toHaveProperty('pending', false);
        });
      });
    });
  });

  describe('after the first property errors', () => {
    beforeEach(async () => {
      await foo.reject(new Error('error'));
      wrapper.update();
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

    it('sets the error', () => {
      expect(wrapped().props()).toHaveProperty('error', new Error('error'));
    });
  });

  describe('after the second property resolves', () => {
    beforeEach(async () => {
      await bar.resolve('second');
      wrapper.update();
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
    beforeEach(async () => {
      await bar.reject(new Error('error'));
      wrapper.update();
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

    it('sets the error', () => {
      expect(wrapped().props()).toHaveProperty('error', new Error('error'));
    });
  });

  describe('after both properties resolve', () => {
    beforeEach(async () => {
      await foo.resolve('first');
      await bar.resolve('second');
      wrapper.update();
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

    describe('after the user changes', () => {
      beforeEach(async () => {
        bar = mockPromise();
        bar.resolve('second change');
        data.resolve.mockReturnValue(bar);
        await auth.mockWebId('https://example.org/#me');
        wrapper.update();
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

      it('re-evaluates the string expression', () => {
        expect(data.resolve).toBeCalledTimes(2);
      });

      describe('after both properties resolve', () => {
        beforeEach(() => update(wrapper));

        it('passes the same first property value', () => {
          expect(wrapped().props()).toHaveProperty('foo', 'first');
        });

        it('passes the changed second property value', () => {
          expect(wrapped().props()).toHaveProperty('bar', 'second change');
        });

        it('sets pending to false', () => {
          expect(wrapped().props()).toHaveProperty('pending', false);
        });
      });
    });
  });
});

import React from 'react';
import { evaluateList } from '../../src/';
import { mount } from 'enzyme';
import { asyncIterable, setProps, timers } from '../util';

jest.useFakeTimers();

describe('An evaluateList wrapper', () => {
  const Wrapper = evaluateList('items', () => <span>contents</span>);

  describe('for an empty iterable', () => {
    const items = asyncIterable();
    const wrapper = mount(<Wrapper items={items} foo="bar"/>);
    const wrapped = () => wrapper.childAt(0).childAt(0);
    afterAll(() => wrapper.unmount());

    it('renders the wrapped component', () => {
      expect(wrapper.html()).toBe('<span>contents</span>');
    });

    it('passes other properties to the wrapped component', () => {
      expect(wrapped().props()).toHaveProperty('foo', 'bar');
    });

    describe('before resolving', () => {
      it('sets the property to the empty list', () => {
        expect(wrapped().props()).toHaveProperty('items', []);
      });

      it('sets pending to true', () => {
        expect(wrapped().props()).toHaveProperty('pending', true);
      });

      it('sets error to undefined', () => {
        expect(wrapped().props()).toHaveProperty('error', undefined);
      });
    });

    describe('after resolving', () => {
      beforeAll(() => timers(wrapper));

      it('sets the property to the empty list', () => {
        expect(wrapped().props()).toHaveProperty('items', []);
      });

      it('sets pending to false', () => {
        expect(wrapped().props()).toHaveProperty('pending', false);
      });

      it('sets error to undefined', () => {
        expect(wrapped().props()).toHaveProperty('error', undefined);
      });
    });
  });

  describe('for an iterable of length 1', () => {
    const items = asyncIterable('a');
    const wrapper = mount(<Wrapper items={items} foo="bar"/>);
    const wrapped = () => wrapper.childAt(0).childAt(0);
    afterAll(() => wrapper.unmount());

    describe('before resolving', () => {
      it('sets the property to the empty list', () => {
        expect(wrapped().props()).toHaveProperty('items', []);
      });

      it('sets pending to true', () => {
        expect(wrapped().props()).toHaveProperty('pending', true);
      });

      it('sets error to undefined', () => {
        expect(wrapped().props()).toHaveProperty('error', undefined);
      });
    });

    describe('after resolving', () => {
      beforeAll(() => timers(wrapper));

      it('sets the property to the items', () => {
        expect(wrapped().props()).toHaveProperty('items', ['a']);
      });

      it('sets pending to false', () => {
        expect(wrapped().props()).toHaveProperty('pending', false);
      });

      it('sets error to undefined', () => {
        expect(wrapped().props()).toHaveProperty('error', undefined);
      });
    });
  });

  describe('for an iterable of length 3', () => {
    const items = asyncIterable('a', 'b', 'c');
    const wrapper = mount(<Wrapper items={items} foo="bar"/>);
    const wrapped = () => wrapper.childAt(0).childAt(0);
    afterAll(() => wrapper.unmount());

    describe('before resolving', () => {
      it('sets the property to the empty list', () => {
        expect(wrapped().props()).toHaveProperty('items', []);
      });

      it('sets pending to true', () => {
        expect(wrapped().props()).toHaveProperty('pending', true);
      });

      it('sets error to undefined', () => {
        expect(wrapped().props()).toHaveProperty('error', undefined);
      });
    });

    describe('after resolving', () => {
      beforeAll(() => timers(wrapper));

      it('sets the property to the items', () => {
        expect(wrapped().props()).toHaveProperty('items', ['a', 'b', 'c']);
      });

      it('sets pending to false', () => {
        expect(wrapped().props()).toHaveProperty('pending', false);
      });

      it('sets error to undefined', () => {
        expect(wrapped().props()).toHaveProperty('error', undefined);
      });
    });
  });

  describe('for an iterable that errors', () => {
    const items = asyncIterable('a', 'b', new Error('c'), 'd');
    const wrapper = mount(<Wrapper items={items} foo="bar"/>);
    const wrapped = () => wrapper.childAt(0).childAt(0);
    afterAll(() => wrapper.unmount());

    describe('before resolving', () => {
      it('sets the property to the empty list', () => {
        expect(wrapped().props()).toHaveProperty('items', []);
      });

      it('sets pending to true', () => {
        expect(wrapped().props()).toHaveProperty('pending', true);
      });

      it('sets error to undefined', () => {
        expect(wrapped().props()).toHaveProperty('error', undefined);
      });
    });

    describe('after resolving', () => {
      beforeAll(() => timers(wrapper));

      it('sets the property to the items before the error', () => {
        expect(wrapped().props()).toHaveProperty('items', ['a', 'b']);
      });

      it('sets pending to false', () => {
        expect(wrapped().props()).toHaveProperty('pending', false);
      });

      it('sets the error property', () => {
        expect(wrapped().props()).toHaveProperty('error', new Error('c'));
      });
    });
  });

  describe('for an iterable that is replaced during iteration', () => {
    let wrapper, items;
    const wrapped = () => wrapper.childAt(0).childAt(0);
    beforeEach(async () => {
      items = asyncIterable('a', 'b', undefined, 'c', 'd');
      wrapper = mount(<Wrapper items={items}/>);
      await timers(wrapper);
    });
    afterEach(() => wrapper.unmount());

    describe('before replacing', () => {
      beforeEach(() => timers(wrapper));

      it('sets the property to the items so far', () => {
        expect(wrapped().props()).toHaveProperty('items', ['a', 'b']);
      });

      it('sets pending to true', () => {
        expect(wrapped().props()).toHaveProperty('pending', true);
      });

      it('sets error to undefined', () => {
        expect(wrapped().props()).toHaveProperty('error', undefined);
      });
    });

    describe('after replacing', () => {
      let newItems;
      beforeEach(async () => {
        newItems = asyncIterable('x', 'y', undefined, 'z');
        await setProps(wrapper, { items: newItems });
        await items.resume();
        await timers(wrapper);
      });

      describe('while the replacement is iterating', () => {
        it('sets the property to the items so far', () => {
          expect(wrapped().props()).toHaveProperty('items', ['x', 'y']);
        });

        it('sets pending to true', () => {
          expect(wrapped().props()).toHaveProperty('pending', true);
        });

        it('sets error to undefined', () => {
          expect(wrapped().props()).toHaveProperty('error', undefined);
        });
      });

      describe('after the replacement is done iterating', () => {
        beforeEach(async () => {
          await newItems.resume();
          await timers(wrapper);
        });

        it('sets the property to all items', () => {
          expect(wrapped().props()).toHaveProperty('items', ['x', 'y', 'z']);
        });

        it('sets pending to false', () => {
          expect(wrapped().props()).toHaveProperty('pending', false);
        });

        it('sets error to undefined', () => {
          expect(wrapped().props()).toHaveProperty('error', undefined);
        });
      });
    });
  });
});

import React from 'react';
import { List } from '../../src/';
import { mount } from 'enzyme';
import { asyncIterable } from '../util';
import data from '@solid/query-ldflex';

describe('A List', () => {
  describe('for an expression resulting in a list of size 0', () => {
    const items = [];
    const iterable = asyncIterable(undefined, ...items);
    let list;
    beforeAll(() => {
      data.resolve.mockReturnValue(iterable);
      list = mount(<List src="expr.items"/>);
    });
    afterAll(() => list.unmount());

    describe('before resolving', () => {
      it('renders the empty list', () => {
        expect(list.html()).toBe('<ul></ul>');
      });
    });

    describe('after resolving', () => {
      beforeEach(async () => {
        await iterable.resume();
        list.update();
      });

      it('renders the empty list', () => {
        expect(list.html()).toBe('<ul></ul>');
      });
    });
  });

  describe('for an expression resulting in a list of size 3', () => {
    const items = ['a', 'b', 'c'];
    const iterable = asyncIterable(undefined, ...items);
    let list;
    beforeAll(() => {
      data.resolve.mockReturnValue(iterable);
      list = mount(<List src="expr.items"/>);
    });
    afterAll(() => list.unmount());

    describe('before resolving', () => {
      it('renders the empty list', () => {
        expect(list.html()).toBe('<ul></ul>');
      });
    });

    describe('after resolving', () => {
      beforeEach(async () => {
        await iterable.resume();
        list.update();
      });

      it('renders a element list of size 3', () => {
        expect(list.find('ul').children()).toHaveLength(items.length);
        list.find('ul').children().forEach(c =>
          expect(c.name()).toBe('li'));
      });

      it('contains the correct elements', () => {
        expect(list.find('ul').children().map(c => c.text())).toEqual(items);
      });
    });
  });
});

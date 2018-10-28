import React from 'react';
import { List } from '../../src/';
import { mount } from 'enzyme';
import { asyncIterable, update } from '../util';
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

  describe('with children and a container', () => {
    const items = ['a', 'b', 'c'];
    const iterable = asyncIterable(...items);
    let list;
    beforeAll(async () => {
      data.resolve.mockReturnValue(iterable);
      list = mount(
        <List src="expr.items" container={children => <div>{children}</div>}>
          {(item, i) => <span key={i}>{item}</span>}
        </List>
      );
      await update(list);
    });
    afterAll(() => list.unmount());

    it('uses the custom container', () => {
      expect(list.find('div').children()).toHaveLength(items.length);
    });

    it('uses the custom children function', () => {
      expect(list.find('div').children()).toHaveLength(3);
      list.find('div').children().forEach((child, i) => {
        expect(child.name()).toBe('span');
        expect(child.text()).toBe(items[i]);
      });
    });
  });

  describe('with children and an empty container', () => {
    const items = ['a', 'b', 'c'];
    const iterable = asyncIterable(...items);
    let list;
    beforeAll(async () => {
      data.resolve.mockReturnValue(iterable);
      list = mount(
        <List src="expr.items" container="">
          {(item, i) => <span key={i}>{item}</span>}
        </List>
      );
      await update(list);
    });
    afterAll(() => list.unmount());

    it('uses no container', () => {
      expect(list.find('ul')).toHaveLength(0);
    });

    it('uses the custom children function', () => {
      expect(list.find('span')).toHaveLength(3);
      list.find('span').forEach((child, i) => {
        expect(child.name()).toBe('span');
        expect(child.text()).toBe(items[i]);
      });
    });
  });

  describe('with a limit and offset', () => {
    const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    const iterable = asyncIterable(...items);
    let list;
    beforeAll(async () => {
      data.resolve.mockReturnValue(iterable);
      list = mount(<List src="expr.items" offset="2" limit="3"/>);
      await update(list);
    });
    afterAll(() => list.unmount());

    it('renders `limit` elements', () => {
      expect(list.find('ul').children()).toHaveLength(3);
    });

    it('starts at `offset`', () => {
      expect(list.find('ul').childAt(0).text()).toBe('c');
    });

    it('renders all items', () => {
      expect(list.find('ul').childAt(0).text()).toBe('c');
      expect(list.find('ul').childAt(1).text()).toBe('d');
      expect(list.find('ul').childAt(2).text()).toBe('e');
    });
  });

  describe('with a filter', () => {
    const items = [0, 1, 2, 3, 4, 5, 6];
    const iterable = asyncIterable(...items);
    let list;
    beforeAll(async () => {
      data.resolve.mockReturnValue(iterable);
      list = mount(<List src="expr.items" filter={n => n % 2}/>);
      await update(list);
    });
    afterAll(() => list.unmount());

    it('renders matching items', () => {
      expect(list.find('ul').children()).toHaveLength(3);
      expect(list.find('ul').childAt(0).text()).toBe('1');
      expect(list.find('ul').childAt(1).text()).toBe('3');
      expect(list.find('ul').childAt(2).text()).toBe('5');
    });
  });
});

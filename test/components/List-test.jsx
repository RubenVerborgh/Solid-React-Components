import React from 'react';
import { List } from '../../src/';
import { render, cleanup, waitForDomChange } from 'react-testing-library';
import { asyncIterable } from '../util';
import data from '@solid/query-ldflex';

describe('A List', () => {
  let container, iterable;
  afterAll(cleanup);

  describe('for an expression resulting in a list of size 0', () => {
    beforeAll(() => {
      const items = [];
      iterable = asyncIterable(undefined, ...items);
      data.resolve.mockReturnValue(iterable);
      ({ container } = render(<List src="expr.items"/>));
    });

    describe('before resolving', () => {
      beforeAll(async () => {
        await iterable;
      });

      it('renders the empty list', () => {
        expect(container.innerHTML).toBe('<ul></ul>');
      });
    });

    describe('after resolving', () => {
      beforeAll(async () => {
        await iterable.resume();
      });

      it('renders the empty list', () => {
        expect(container.innerHTML).toBe('<ul></ul>');
      });
    });
  });

  describe('for an expression resulting in a list of size 3', () => {
    beforeAll(() => {
      const items = ['a', 'b', 'c'];
      iterable = asyncIterable(undefined, ...items);
      data.resolve.mockReturnValue(iterable);
      ({ container } = render(<List src="expr.items"/>));
    });

    describe('before resolving', () => {
      beforeAll(async () => {
        await iterable;
      });

      it('renders the empty list', () => {
        expect(container.innerHTML).toBe('<ul></ul>');
      });
    });

    describe('after resolving', () => {
      beforeAll(async () => {
        iterable.resume();
        await waitForDomChange();
      });

      it('renders a element list of size 3', () => {
        expect(container.innerHTML).toBe(
          '<ul><li>a</li><li>b</li><li>c</li></ul>');
      });
    });
  });

  describe('with children and a container', () => {
    beforeAll(async () => {
      const items = ['a', 'b', 'c'];
      iterable = asyncIterable(...items);
      data.resolve.mockReturnValue(iterable);
      ({ container } = render(
        <List src="expr.items" container={children => <div>{children}</div>}>
          {(item, i) => <span key={i}>{item}</span>}
        </List>
      ));
      await waitForDomChange();
    });

    it('uses the custom children function', () => {
      expect(container.innerHTML).toBe(
        '<div><span>a</span><span>b</span><span>c</span></div>');
    });
  });

  describe('with children and an empty container', () => {
    beforeAll(async () => {
      const items = ['a', 'b', 'c'];
      iterable = asyncIterable(...items);
      data.resolve.mockReturnValue(iterable);
      ({ container } = render(
        <List src="expr.items" container="">
          {(item, i) => <span key={i}>{item}</span>}
        </List>
      ));
      await waitForDomChange();
    });

    it('uses no container', () => {
      expect(container.innerHTML).toBe(
        '<span>a</span><span>b</span><span>c</span>');
    });
  });

  describe('with a limit and offset', () => {
    beforeAll(async () => {
      const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
      iterable = asyncIterable(...items);
      data.resolve.mockReturnValue(iterable);
      ({ container } = render(<List src="expr.items" offset="2" limit="3"/>));
      await waitForDomChange();
    });

    it('renders `limit` elements starting at `offset`', () => {
      expect(container.innerHTML).toBe(
        '<ul><li>c</li><li>d</li><li>e</li></ul>');
    });
  });

  describe('with a filter', () => {
    beforeAll(async () => {
      const items = [0, 1, 2, 3, 4, 5, 6];
      iterable = asyncIterable(...items);
      data.resolve.mockReturnValue(iterable);
      ({ container } = render(<List src="expr.items" filter={n => n % 2}/>));
      await waitForDomChange();
    });

    it('renders matching items', () => {
      expect(container.innerHTML).toBe(
        '<ul><li>1</li><li>3</li><li>5</li></ul>');
    });
  });
});

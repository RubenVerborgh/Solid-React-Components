import React from 'react';
import { List } from '../../src/';
import { render, cleanup } from '@testing-library/react';
import useLDflex from '../../src/hooks/useLDflex';

jest.mock('../../src/hooks/useLDflex', () => require('../__mocks__/useLDflex'));

describe('A List', () => {
  let container;
  afterAll(cleanup);

  describe('for an expression resulting in a list of size 0', () => {
    beforeAll(() => {
      ({ container } = render(<List src="expr.items"/>));
    });

    describe('before resolving', () => {
      it('renders the empty list', () => {
        expect(container.innerHTML).toBe('<ul></ul>');
      });
    });

    describe('after resolving', () => {
      beforeAll(() => {
        useLDflex.resolve('expr.items', []);
      });

      it('renders the empty list', () => {
        expect(container.innerHTML).toBe('<ul></ul>');
      });
    });
  });

  describe('for an expression resulting in a list of size 3', () => {
    beforeAll(() => {
      ({ container } = render(<List src="expr.items"/>));
    });

    describe('before resolving', () => {
      it('renders the empty list', () => {
        expect(container.innerHTML).toBe('<ul></ul>');
      });
    });

    describe('after resolving', () => {
      beforeAll(() => {
        useLDflex.resolve('expr.items', ['a', 'b', 'c']);
      });

      it('renders a element list of size 3', () => {
        expect(container.innerHTML).toBe(
          '<ul><li>a</li><li>b</li><li>c</li></ul>');
      });
    });
  });

  describe('with children and a container', () => {
    beforeAll(() => {
      ({ container } = render(
        <List src="expr.items" container={children => <div>{children}</div>}>
          {(item, i) => <span key={i}>{item}</span>}
        </List>
      ));
      useLDflex.resolve('expr.items', ['a', 'b', 'c']);
    });

    it('uses the custom children function', () => {
      expect(container.innerHTML).toBe(
        '<div><span>a</span><span>b</span><span>c</span></div>');
    });
  });

  describe('with children and an empty container', () => {
    beforeAll(() => {
      ({ container } = render(
        <List src="expr.items" container="">
          {(item, i) => <span key={i}>{item}</span>}
        </List>
      ));
      useLDflex.resolve('expr.items', ['a', 'b', 'c']);
    });

    it('uses no container', () => {
      expect(container.innerHTML).toBe(
        '<span>a</span><span>b</span><span>c</span>');
    });
  });

  describe('with a limit and offset', () => {
    beforeAll(() => {
      ({ container } = render(<List src="expr.items" offset="2" limit="3"/>));
      useLDflex.resolve('expr.items', ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
    });

    it('renders `limit` elements starting at `offset`', () => {
      expect(container.innerHTML).toBe(
        '<ul><li>c</li><li>d</li><li>e</li></ul>');
    });
  });

  describe('with a filter', () => {
    beforeAll(() => {
      ({ container } = render(<List src="expr.items" filter={n => n % 2}/>));
      useLDflex.resolve('expr.items', [0, 1, 2, 3, 4, 5, 6]);
    });

    it('renders matching items', () => {
      expect(container.innerHTML).toBe(
        '<ul><li>1</li><li>3</li><li>5</li></ul>');
    });
  });
});

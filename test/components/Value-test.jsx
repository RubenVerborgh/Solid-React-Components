import React from 'react';
import { Value } from '../../src/';
import { render, cleanup } from '@testing-library/react';
import useLDflex from '../../src/hooks/useLDflex';

jest.mock('../../src/hooks/useLDflex', () => require('../__mocks__/useLDflex'));

describe('A Value', () => {
  let container, rerender;
  const span = () => container.firstChild;
  afterEach(cleanup);

  describe('with a string expression', () => {
    beforeEach(() => {
      ({ container, rerender } = render(<Value src="user.firstname"/>));
    });

    describe('before the expression is evaluated', () => {
      it('is an empty span', () => {
        expect(span().tagName).toMatch(/^span$/i);
        expect(span()).toHaveTextContent('');
      });

      it('has the solid class', () => {
        expect(span()).toHaveClass('solid');
      });

      it('has the value class', () => {
        expect(span()).toHaveClass('value');
      });

      it('has the pending class', () => {
        expect(span()).toHaveClass('pending');
      });
    });

    describe('after the expression is evaluated', () => {
      beforeEach(() => {
        useLDflex.resolve('user.firstname', { toString: () => 'contents' });
      });

      it('contains the resolved contents', () => {
        expect(container.innerHTML).toBe('contents');
      });
    });

    describe('after the expression evaluates to undefined', () => {
      beforeEach(() => {
        useLDflex.resolve('user.firstname', undefined);
      });

      it('is an empty span', () => {
        expect(span().tagName).toMatch(/^span$/i);
        expect(span()).toHaveTextContent('');
      });

      it('has the solid class', () => {
        expect(span()).toHaveClass('solid');
      });

      it('has the value class', () => {
        expect(span()).toHaveClass('value');
      });

      it('has the empty class', () => {
        expect(span()).toHaveClass('empty');
      });
    });

    describe('after the expression errors', () => {
      beforeEach(() => {
        useLDflex.reject('user.firstname', new Error('the error message'));
      });

      it('is an empty span', () => {
        expect(span().tagName).toMatch(/^span$/i);
        expect(span()).toHaveTextContent('');
      });

      it('has the error message in the data-error attribute', () => {
        expect(span()).toHaveAttribute('data-error', 'the error message');
      });

      it('has the solid class', () => {
        expect(span()).toHaveClass('solid');
      });

      it('has the value class', () => {
        expect(span()).toHaveClass('value');
      });

      it('has the error class', () => {
        expect(span()).toHaveClass('error');
      });
    });

    describe('after src changes', () => {
      beforeEach(() => {
        rerender(<Value src="user.other"/>);
        useLDflex.resolve('user.other', 'new contents');
      });

      it('contains the resolved contents', () => {
        expect(container).toHaveTextContent('new contents');
      });
    });
  });

  describe('with a string expression and children', () => {
    beforeEach(() => {
      ({ container, rerender } = render(<Value src="user.firstname">children</Value>));
    });

    describe('before the expression is evaluated', () => {
      it('renders the children', () => {
        expect(container).toHaveTextContent('children');
      });
    });

    describe('after the expression is evaluated', () => {
      beforeEach(() => {
        useLDflex.resolve('user.firstname', { toString: () => 'contents' });
      });

      it('contains the resolved contents', () => {
        expect(container.innerHTML).toBe('contents');
      });
    });

    describe('after the expression evaluates to undefined', () => {
      beforeEach(() => {
        useLDflex.resolve('user.firstname', undefined);
      });

      it('renders the children', () => {
        expect(container).toHaveTextContent('children');
      });
    });

    describe('after the expression errors', () => {
      beforeEach(() => {
        useLDflex.reject('user.firstname', new Error('the error message'));
      });

      it('renders the children', () => {
        expect(container).toHaveTextContent('children');
      });
    });
  });
});

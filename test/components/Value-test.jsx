import React from 'react';
import { Value } from '../../src/';
import { act, render, cleanup, waitForDomChange } from 'react-testing-library';
import MockPromise from 'jest-mock-promise';
import data from '@solid/query-ldflex';
import auth from 'solid-auth-client';

describe('A Value', () => {
  let container, expression, rerender;
  const span = () => container.firstChild;
  beforeEach(() => {
    data.resolve.mockReturnValue(expression = new MockPromise());
  });
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
      beforeEach(async () => {
        act(() => void expression.resolve({ toString: () => 'contents' }));
        await waitForDomChange();
      });

      it('contains the resolved contents', () => {
        expect(container.innerHTML).toBe('contents');
      });
    });

    describe('after the expression evaluates to undefined', () => {
      beforeEach(async () => {
        act(() => void expression.resolve(undefined));
        await waitForDomChange();
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
      beforeEach(async () => {
        act(() => void expression.reject(new Error('the error message')));
        await waitForDomChange();
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
      beforeEach(async () => {
        data.resolve.mockReturnValue(Promise.resolve('new contents'));
        rerender(<Value src="user.other"/>);
        await waitForDomChange();
      });

      it('contains the resolved contents', () => {
        expect(container).toHaveTextContent('new contents');
      });
    });

    describe('after the user changes', () => {
      beforeEach(async () => {
        data.resolve.mockReturnValue(Promise.resolve('new user'));
        act(() => void auth.mockWebId('https://example.org/#me'));
        await waitForDomChange();
      });

      it('re-evaluates the expression', () => {
        expect(container).toHaveTextContent('new user');
      });
    });
  });

  describe('with a thenable', () => {
    beforeEach(() => {
      ({ container, rerender } = render(<Value src={new MockPromise()}/>));
    });

    describe('after the user changes', () => {
      beforeEach(async () => {
        data.resolve.mockReturnValue(Promise.resolve('new user'));
        act(() => void auth.mockWebId('https://example.org/#me'));
      });

      it('does not re-evaluate the expression', async () => {
        await expect(waitForDomChange({ timeout: 50 })).rejects.toThrow();
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
      beforeEach(async () => {
        act(() => void expression.resolve({ toString: () => 'contents' }));
        await waitForDomChange();
      });

      it('contains the resolved contents', () => {
        expect(container.innerHTML).toBe('contents');
      });
    });

    describe('after the expression evaluates to undefined', () => {
      beforeEach(async () => {
        act(() => void expression.resolve(undefined));
        await expect(waitForDomChange({ timeout: 50 })).rejects.toThrow();
      });

      it('renders the children', () => {
        expect(container).toHaveTextContent('children');
      });
    });

    describe('after the expression errors', () => {
      beforeEach(async () => {
        act(() => void expression.reject(new Error('the error message')));
        await expect(waitForDomChange({ timeout: 50 })).rejects.toThrow();
      });

      it('renders the children', () => {
        expect(container).toHaveTextContent('children');
      });
    });
  });
});

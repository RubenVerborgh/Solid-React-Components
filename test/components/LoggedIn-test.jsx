import React from 'react';
import { LoggedIn } from '../../src/';
import { act, render, cleanup } from 'react-testing-library';
import auth from 'solid-auth-client';

describe('A LoggedIn pane', () => {
  let container;
  afterAll(cleanup);

  describe('with children', () => {
    beforeAll(() => {
      ({ container } = render(<LoggedIn>Logged in</LoggedIn>));
    });

    describe('when the user is not logged in', () => {
      beforeAll(() => !act(() => {
        auth.mockWebId(null);
      }));

      it('is empty', () => {
        expect(container.innerHTML).toBe('');
      });
    });

    describe('when the user is logged in', () => {
      beforeAll(() => !act(() => {
        auth.mockWebId('https://example.org/#me');
      }));

      it('renders the content', () => {
        expect(container.innerHTML).toBe('Logged in');
      });
    });
  });

  describe('without children', () => {
    beforeAll(() => {
      ({ container } = render(<LoggedIn/>));
    });

    describe('when the user is logged in', () => {
      beforeAll(() => !act(() => {
        auth.mockWebId('https://example.org/#me');
      }));

      it('is empty', () => {
        expect(container.innerHTML).toBe('');
      });
    });
  });
});

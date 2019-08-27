import React from 'react';
import { LoggedOut } from '../../src/';
import { render, cleanup } from '@testing-library/react';
import auth from 'solid-auth-client';

describe('A LoggedOut pane', () => {
  let container;
  afterAll(cleanup);

  describe('with children', () => {
    beforeAll(() => {
      ({ container } = render(<LoggedOut>Logged out</LoggedOut>));
    });

    describe('when the user is not logged in', () => {
      beforeAll(() => auth.mockWebId(null));

      it('renders the content', () => {
        expect(container.innerHTML).toBe('Logged out');
      });
    });

    describe('when the user is logged in', () => {
      beforeAll(() => auth.mockWebId('https://example.org/#me'));

      it('is empty', () => {
        expect(container.innerHTML).toBe('');
      });
    });
  });

  describe('without children', () => {
    beforeAll(() => {
      ({ container } = render(<LoggedOut/>));
    });

    describe('when the user is not logged in', () => {
      beforeAll(() => auth.mockWebId(null));

      it('is empty', () => {
        expect(container.innerHTML).toBe('');
      });
    });
  });
});

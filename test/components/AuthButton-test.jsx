import React from 'react';
import { AuthButton } from '../../src/';
import { render, cleanup } from 'react-testing-library';
import auth from 'solid-auth-client';

describe('An AuthButton', () => {
  let container;
  const button = () => container.firstChild;
  afterAll(cleanup);

  describe('without properties', () => {
    beforeAll(() => {
      ({ container } = render(<AuthButton/>));
    });

    describe('when the user is not logged in', () => {
      beforeAll(() => auth.mockWebId(null));

      it('renders the login button', () => {
        expect(button()).toHaveTextContent('Log in');
      });

      it('uses default class names', () => {
        expect(button()).toHaveClass('solid', 'auth', 'login');
        expect(button()).not.toHaveClass('logout');
      });
    });

    describe('when the user is logged in', () => {
      beforeAll(() => auth.mockWebId('https://example.org/#me'));

      it('renders the logout button', () => {
        expect(button()).toHaveTextContent('Log out');
      });

      it('uses default class names', () => {
        expect(button()).toHaveClass('solid', 'auth', 'logout');
        expect(button()).not.toHaveClass('login');
      });
    });
  });

  describe('with a className property', () => {
    beforeAll(() => {
      ({ container } = render(<AuthButton className="custom styling"/>));
    });

    describe('when the user is not logged in', () => {
      beforeAll(() => auth.mockWebId(null));

      it('does not use the built-in classes', () => {
        expect(button()).not.toHaveClass('solid', 'auth', 'logout');
      });

      it('uses the custom classes', () => {
        expect(button()).toHaveClass('custom', 'styling');
      });
    });

    describe('when the user is logged in', () => {
      beforeAll(() => auth.mockWebId('https://example.org/#me'));

      it('does not use the built-in classes', () => {
        expect(button()).not.toHaveClass('solid', 'auth', 'logout');
      });

      it('uses the custom classes', () => {
        expect(button()).toHaveClass('custom', 'styling');
      });
    });
  });

  describe('with custom labels', () => {
    beforeAll(() => {
      ({ container } = render(<AuthButton login="Hello" logout="Goodbye"/>));
    });

    describe('when the user is not logged in', () => {
      beforeAll(() => auth.mockWebId(null));

      it('uses the custom login label', () => {
        expect(button()).toHaveTextContent('Hello');
      });
    });

    describe('when the user is logged in', () => {
      beforeAll(() => auth.mockWebId('https://example.org/#me'));

      it('uses the custom logout label', () => {
        expect(button()).toHaveTextContent('Goodbye');
      });
    });
  });
});

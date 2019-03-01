import React from 'react';
import { LoginButton } from '../../src/';
import { render, fireEvent, cleanup } from 'react-testing-library';
import auth from 'solid-auth-client';

describe('A LoginButton', () => {
  let button;
  afterAll(cleanup);

  describe('with a popup attribute', () => {
    beforeAll(() => {
      const { container } = render(<LoginButton popup="popup.html"/>);
      button = container.firstChild;
    });

    it('has the solid class', () => {
      expect(button).toHaveClass('solid');
    });

    it('has the auth class', () => {
      expect(button).toHaveClass('auth');
    });

    it('has the login class', () => {
      expect(button).toHaveClass('login');
    });

    it('has "Log in" as label', () => {
      expect(button).toHaveTextContent('Log in');
    });

    it('logs the user in when clicked', () => {
      expect(auth.popupLogin).not.toHaveBeenCalled();
      fireEvent.click(button);
      expect(auth.popupLogin).toHaveBeenCalledTimes(1);
      expect(auth.popupLogin).toHaveBeenCalledWith({ popupUri: 'popup.html' });
    });
  });

  describe('with a string as child', () => {
    beforeAll(() => {
      const { container } = render(<LoginButton>Hello</LoginButton>);
      button = container.firstChild;
    });

    it('has the string as label', () => {
      expect(button).toHaveTextContent('Hello');
    });
  });
});

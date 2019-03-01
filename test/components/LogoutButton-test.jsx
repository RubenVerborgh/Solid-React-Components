import React from 'react';
import { LogoutButton } from '../../src/';
import { render, fireEvent, cleanup } from 'react-testing-library';
import auth from 'solid-auth-client';

describe('A LogoutButton', () => {
  let button;
  afterAll(cleanup);

  describe('without attributes', () => {
    beforeAll(() => {
      const { container } = render(<LogoutButton/>);
      button = container.firstChild;
    });

    it('has the solid class', () => {
      expect(button).toHaveClass('solid');
    });

    it('has the auth class', () => {
      expect(button).toHaveClass('auth');
    });

    it('has the logout class', () => {
      expect(button).toHaveClass('logout');
    });

    it('has "Log out" as label', () => {
      expect(button).toHaveTextContent('Log out');
    });

    it('logs the user out when clicked', () => {
      expect(auth.logout).not.toHaveBeenCalled();
      fireEvent.click(button);
      expect(auth.logout).toHaveBeenCalledTimes(1);
      expect(auth.logout).toHaveBeenCalledWith();
    });
  });

  describe('with a string as child', () => {
    beforeAll(() => {
      const { container } = render(<LogoutButton>Goodbye</LogoutButton>);
      button = container.firstChild;
    });

    it('has the string as label', () => {
      expect(button).toHaveTextContent('Goodbye');
    });
  });
});

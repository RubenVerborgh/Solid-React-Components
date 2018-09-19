import React from 'react';
import { AuthButton } from '../../src/';
import { mount } from 'enzyme';
import auth from 'solid-auth-client';

jest.mock('solid-auth-client');

describe('An AuthButton', () => {
  let button, setSession;

  beforeAll(() => {
    auth.trackSession.mockImplementationOnce(cb => (setSession = cb));
    button = mount(<AuthButton/>);
  });

  describe('when the user is not logged in', () => {
    beforeAll(() => setSession(null));

    it('renders the log in button', () => {
      expect(button.text()).toBe('Log in');
    });
  });

  describe('renders the log out button', () => {
    beforeAll(() => setSession({}));

    it('has "Log out" as text', () => {
      expect(button.text()).toBe('Log out');
    });
  });
});

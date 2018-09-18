import React from 'react';
import { LoginButton } from '../../src/';
import { shallow } from 'enzyme';
import auth from 'solid-auth-client';

jest.mock('solid-auth-client');

describe('A LoginButton', () => {
  let button, sessionCallback;

  beforeAll(() => {
    auth.trackSession.mockImplementationOnce(cb => (sessionCallback = cb));
    button = shallow(<LoginButton/>);
  });

  describe('when the user is not logged in', () => {
    const session = null;
    beforeAll(() => sessionCallback(session));

    it('has "Log in" as text', () => {
      expect(button.text()).toBe('Log in');
    });

    it('logs the user in when clicked', () => {
      expect(auth.popupLogin).not.toBeCalled();
      button.simulate('click');
      expect(auth.popupLogin).toBeCalledTimes(1);
      expect(auth.popupLogin).toBeCalledWith();
    });

    it('has the solid class', () => {
      expect(button.hasClass('solid')).toBe(true);
    });

    it('has the login class', () => {
      expect(button.hasClass('login')).toBe(true);
    });
  });

  describe('when the user is logged in', () => {
    const session = { webId: 'https://ex.org/#me' };
    beforeAll(() => sessionCallback(session));

    it('has "Log out" as text', () => {
      expect(button.text()).toBe('Log out');
    });

    it('logs the user out when clicked', () => {
      expect(auth.logout).not.toBeCalled();
      button.simulate('click');
      expect(auth.logout).toBeCalledTimes(1);
      expect(auth.logout).toBeCalledWith();
    });

    it('has the solid class', () => {
      expect(button.hasClass('solid')).toBe(true);
    });

    it('has the logout class', () => {
      expect(button.hasClass('logout')).toBe(true);
    });
  });
});

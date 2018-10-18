import React from 'react';
import { LoginButton } from '../../src/';
import { shallow } from 'enzyme';
import auth from 'solid-auth-client';

describe('A LoginButton', () => {
  const button = shallow(<LoginButton popup="popup.html"/>);

  it('has the solid class', () => {
    expect(button.hasClass('solid')).toBe(true);
  });

  it('has the auth class', () => {
    expect(button.hasClass('auth')).toBe(true);
  });

  it('has the login class', () => {
    expect(button.hasClass('login')).toBe(true);
  });

  it('has "Log in" as text', () => {
    expect(button.text()).toBe('Log in');
  });

  it('logs the user in when clicked', () => {
    expect(auth.popupLogin).not.toBeCalled();
    button.simulate('click');
    expect(auth.popupLogin).toBeCalledTimes(1);
    expect(auth.popupLogin).toBeCalledWith({ popupUri: 'popup.html' });
  });
});

import React from 'react';
import { LogoutButton } from '../../src/';
import { shallow } from 'enzyme';
import auth from 'solid-auth-client';

jest.mock('solid-auth-client');

describe('A LogoutButton', () => {
  const button = shallow(<LogoutButton/>);

  it('has the solid class', () => {
    expect(button.hasClass('solid')).toBe(true);
  });

  it('has the auth class', () => {
    expect(button.hasClass('auth')).toBe(true);
  });

  it('has the logout class', () => {
    expect(button.hasClass('logout')).toBe(true);
  });

  it('has "Log out" as text', () => {
    expect(button.text()).toBe('Log out');
  });

  it('logs the user out when clicked', () => {
    expect(auth.logout).not.toBeCalled();
    button.simulate('click');
    expect(auth.logout).toBeCalledTimes(1);
    expect(auth.logout).toBeCalledWith();
  });
});

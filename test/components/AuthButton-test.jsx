import React from 'react';
import { AuthButton } from '../../src/';
import { mount } from 'enzyme';
import auth from 'solid-auth-client';

describe('An AuthButton', () => {
  describe('without properties', () => {
    let button;
    beforeEach(() => (button = mount(<AuthButton />)));
    afterEach(() => button.unmount());

    describe('when the user is not logged in', () => {
      beforeAll(() => auth.mockWebId(null));

      it('renders the login button', () => {
        expect(button.text()).toBe('Log in');
      });

      it('uses default class names', () => {
        expect(button.find('button').hasClass('solid')).toBe(true);
        expect(button.find('button').hasClass('auth')).toBe(true);
        expect(button.find('button').hasClass('login')).toBe(true);
        expect(button.find('button').hasClass('logout')).toBe(false);
      });
    });

    describe('when the user is logged in', () => {
      beforeAll(() => auth.mockWebId('https://example.org/#me'));

      it('renders the logout button', () => {
        expect(button.text()).toBe('Log out');
      });

      it('uses default class names', () => {
        expect(button.find('button').hasClass('solid')).toBe(true);
        expect(button.find('button').hasClass('auth')).toBe(true);
        expect(button.find('button').hasClass('login')).toBe(false);
        expect(button.find('button').hasClass('logout')).toBe(true);
      });
    });
  });

  describe('with a className property', function () {
    let button;
    beforeEach(() => (button = mount(<AuthButton className="custom styling"/>)));
    afterEach(() => button.unmount());

    describe('when the user is not logged in', () => {
      beforeAll(() => auth.mockWebId(null));

      it('does not use the built-in classes', () => {
        expect(button.find('button').hasClass('solid')).toBe(false);
        expect(button.find('button').hasClass('auth')).toBe(false);
        expect(button.find('button').hasClass('login')).toBe(false);
        expect(button.find('button').hasClass('logout')).toBe(false);
      });

      it('uses the custom classes', () => {
        expect(button.find('button').hasClass('custom')).toBe(true);
        expect(button.find('button').hasClass('styling')).toBe(true);
      });
    });

    describe('when the user is logged in', () => {
      beforeAll(() => auth.mockWebId('https://example.org/#me'));

      it('does not use the built-in classes', () => {
        expect(button.find('button').hasClass('solid')).toBe(false);
        expect(button.find('button').hasClass('auth')).toBe(false);
        expect(button.find('button').hasClass('login')).toBe(false);
        expect(button.find('button').hasClass('logout')).toBe(false);
      });

      it('uses the custom classes', () => {
        expect(button.find('button').hasClass('custom')).toBe(true);
        expect(button.find('button').hasClass('styling')).toBe(true);
      });
    });
  });
});

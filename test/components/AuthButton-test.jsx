import React from 'react';
import { AuthButton } from '../../src/';
import { mount } from 'enzyme';
import auth from 'solid-auth-client';

describe('An AuthButton', () => {
  describe('default', function () {
    let button;
    beforeEach(() => (button = mount(<AuthButton />)));
    afterEach(() => button.unmount());

    describe('when the user is not logged in', () => {
      beforeAll(() => auth.mockWebId(null));

      it('renders the log in button', () => {
        expect(button.text()).toBe('Log in');
      });

      it('uses default class names', () => {
        expect(button.find('button').prop('className')).toEqual('solid auth login');
      });
    });

    describe('renders the log out button', () => {
      beforeAll(() => auth.mockWebId('https://example.org/#me'));

      it('has "Log out" as text', () => {
        expect(button.text()).toBe('Log out');
      });

      it('uses default class names', () => {
        expect(button.find('button').prop('className')).toEqual('solid auth logout');
      });
    });
  });

  describe('custom class names', function () {
    let button;
    beforeEach(() => (button = mount(<AuthButton className="custom styling"/>)));
    afterEach(() => button.unmount());

    describe('when the user is not logged in', () => {
      beforeAll(() => auth.mockWebId(null));

      it('respects custom styling in button class name', () => {
        expect(button.find('button').prop('className')).toEqual('custom styling');
      });
    });

    describe('renders the log out button', () => {
      beforeAll(() => auth.mockWebId('https://example.org/#me'));

      it('respects custom styling in button class name', () => {
        expect(button.find('button').prop('className')).toEqual('custom styling');
      });
    });
  });
});

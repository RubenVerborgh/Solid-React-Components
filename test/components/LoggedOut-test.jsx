import React from 'react';
import { LoggedOut } from '../../src/';
import { mount } from 'enzyme';
import auth from 'solid-auth-client';

describe('A LoggedOut pane', () => {
  let pane;

  describe('with children', () => {
    beforeAll(() => {
      pane = mount(<LoggedOut>Logged out</LoggedOut>);
    });
    afterAll(() => pane.unmount());

    describe('when the user is not logged in', () => {
      beforeAll(() => auth.mockWebId(null));

      it('renders the content', () => {
        expect(pane.text()).toBe('Logged out');
      });
    });

    describe('when the user is logged in', () => {
      beforeAll(() => auth.mockWebId('https://example.org/#me'));

      it('is empty', () => {
        expect(pane.text()).toBe(null);
      });
    });
  });

  describe('without children', () => {
    beforeAll(() => (pane = mount(<LoggedOut/>)));
    afterAll(() => pane.unmount());

    describe('when the user is not logged in', () => {
      beforeAll(() => auth.mockWebId(null));

      it('is empty', () => {
        expect(pane.text()).toBe(null);
      });
    });
  });
});

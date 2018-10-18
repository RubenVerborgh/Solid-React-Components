import React from 'react';
import { LoggedInPane } from '../../src/';
import { mount } from 'enzyme';
import auth from 'solid-auth-client';

describe('A LoggedInPane', () => {
  let pane;

  describe('with children', () => {
    beforeAll(() => {
      pane = mount(<LoggedInPane>Logged in</LoggedInPane>);
    });
    afterAll(() => pane.unmount());

    describe('when the user is not logged in', () => {
      beforeAll(() => auth.mockWebId(null));

      it('is empty', () => {
        expect(pane.text()).toBe(null);
      });
    });

    describe('when the user is logged in', () => {
      beforeAll(() => auth.mockWebId('https://example.org/#me'));

      it('renders the content', () => {
        expect(pane.text()).toBe('Logged in');
      });
    });
  });

  describe('without children', () => {
    beforeAll(() => (pane = mount(<LoggedInPane/>)));
    afterAll(() => pane.unmount());

    describe('when the user is logged in', () => {
      beforeAll(() => auth.mockWebId('https://example.org/#me'));

      it('is empty', () => {
        expect(pane.text()).toBe(null);
      });
    });
  });
});

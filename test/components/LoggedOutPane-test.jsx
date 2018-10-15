import React from 'react';
import { LoggedOutPane } from '../../src/';
import { mount } from 'enzyme';
import auth from 'solid-auth-client';

jest.mock('solid-auth-client');

describe('A LoggedOutPane', () => {
  let pane, setSession;

  describe('with children', () => {
    beforeAll(() => {
      auth.trackSession.mockImplementationOnce(cb => (setSession = cb));
      pane = mount(<LoggedOutPane>Logged out</LoggedOutPane>);
    });

    describe('when the user is not logged in', () => {
      beforeAll(() => setSession(null));

      it('renders the content', () => {
        expect(pane.text()).toBe('Logged out');
      });
    });

    describe('when the user is logged in', () => {
      beforeAll(() => setSession({ webId: 'https://example.org/#me' }));

      it('is empty', () => {
        expect(pane.text()).toBe(null);
      });
    });
  });

  describe('without children', () => {
    beforeAll(() => {
      auth.trackSession.mockImplementationOnce(cb => (setSession = cb));
      pane = mount(<LoggedOutPane/>);
    });

    describe('when the user is not logged in', () => {
      beforeAll(() => setSession(null));

      it('is empty', () => {
        expect(pane.text()).toBe(null);
      });
    });
  });
});

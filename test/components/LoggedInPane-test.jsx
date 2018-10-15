import React from 'react';
import { LoggedInPane } from '../../src/';
import { mount } from 'enzyme';
import auth from 'solid-auth-client';

jest.mock('solid-auth-client');

describe('A LoggedInPane', () => {
  let pane, setSession;

  describe('with children', () => {
    beforeAll(() => {
      auth.trackSession.mockImplementationOnce(cb => (setSession = cb));
      pane = mount(<LoggedInPane>Logged in</LoggedInPane>);
    });

    describe('when the user is not logged in', () => {
      beforeAll(() => setSession(null));

      it('is empty', () => {
        expect(pane.text()).toBe(null);
      });
    });

    describe('when the user is logged in', () => {
      beforeAll(() => setSession({ webId: 'https://example.org/#me' }));

      it('renders the content', () => {
        expect(pane.text()).toBe('Logged in');
      });
    });
  });

  describe('without children', () => {
    beforeAll(() => {
      auth.trackSession.mockImplementationOnce(cb => (setSession = cb));
      pane = mount(<LoggedInPane/>);
    });

    describe('when the user is logged in', () => {
      beforeAll(() => setSession({ webId: 'https://example.org/#me' }));

      it('is empty', () => {
        expect(pane.text()).toBe(null);
      });
    });
  });
});

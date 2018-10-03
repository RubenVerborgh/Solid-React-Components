import React from 'react';
import { AuthPane } from '../../src/';
import { mount } from 'enzyme';
import auth from 'solid-auth-client';

jest.mock('solid-auth-client');

describe('An AuthPane with child panes', () => {
  let pane, setSession;

  beforeAll(() => {
    auth.trackSession.mockImplementationOnce(cb => (setSession = cb));
    pane = mount(<AuthPane
      loggedOut={<span>Logged out</span>}
      loggedIn={<span>Logged in</span>}
    />);
  });

  describe('when the user is not logged in', () => {
    beforeAll(() => setSession(null));

    it('renders the loggedOut content', () => {
      expect(pane.html()).toBe('<span>Logged out</span>');
    });
  });

  describe('when the user is logged in', () => {
    beforeAll(() => setSession({ webId: 'https://example.org/#me' }));

    it('renders the loggedIn content', () => {
      expect(pane.html()).toBe('<span>Logged in</span>');
    });
  });
});

describe('An AuthPane without child panes', () => {
  let pane, setSession;

  beforeAll(() => {
    auth.trackSession.mockImplementationOnce(cb => (setSession = cb));
    pane = mount(<AuthPane/>);
  });

  describe('when the user is not logged in', () => {
    beforeAll(() => setSession(null));

    it('renders no content', () => {
      expect(pane.html()).toBe(null);
    });
  });

  describe('when the user is logged in', () => {
    beforeAll(() => setSession({ webId: 'https://example.org/#me' }));

    it('renders no content', () => {
      expect(pane.html()).toBe(null);
    });
  });
});

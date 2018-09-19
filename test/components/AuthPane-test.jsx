import React from 'react';
import { AuthPane } from '../../src/';
import { shallow } from 'enzyme';
import auth from 'solid-auth-client';

jest.mock('solid-auth-client');

describe('An AuthPane with child panes', () => {
  let pane, setSession;

  beforeAll(() => {
    auth.trackSession.mockImplementationOnce(cb => (setSession = cb));
    pane = shallow(<AuthPane
      loggedOut={<span>Logged out</span>}
      loggedIn={<span>Logged in</span>}
    />);
  });

  describe('when the user is not logged in', () => {
    beforeAll(() => setSession(null));

    it('renders the loggedOut content', () => {
      expect(pane.text()).toBe('Logged out');
    });
  });

  describe('when the user is logged in', () => {
    beforeAll(() => setSession({}));

    it('renders the loggedIn content', () => {
      expect(pane.text()).toBe('Logged in');
    });
  });
});

describe('An AuthPane without child panes', () => {
  let pane, setSession;

  beforeAll(() => {
    auth.trackSession.mockImplementationOnce(cb => (setSession = cb));
    pane = shallow(<AuthPane/>);
  });

  describe('when the user is not logged in', () => {
    beforeAll(() => setSession(null));

    it('renders no content', () => {
      expect(pane.text()).toBe('');
    });
  });

  describe('when the user is logged in', () => {
    beforeAll(() => setSession({}));

    it('renders no content', () => {
      expect(pane.text()).toBe('');
    });
  });
});

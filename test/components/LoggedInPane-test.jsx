import React from 'react';
import { LoggedInPane } from '../../src/';
import { mount } from 'enzyme';
import auth from 'solid-auth-client';

jest.mock('solid-auth-client');

describe('A LoggedInPane', () => {
  let pane, setSession;

  beforeAll(() => {
    auth.trackSession.mockImplementationOnce(cb => (setSession = cb));
    pane = mount(<LoggedInPane>Logged in</LoggedInPane>);
  });

  describe('when the user is not logged in', () => {
    beforeAll(() => setSession(null));

    it('does not render the content', () => {
      expect(pane.text()).toBe(null);
    });
  });

  describe('when the user is logged in', () => {
    beforeAll(() => setSession({}));

    it('renders the content', () => {
      expect(pane.text()).toBe('Logged in');
    });
  });
});

import React from 'react';
import { withWebId } from '../../src/';
import { mount } from 'enzyme';
import auth from 'solid-auth-client';

jest.mock('solid-auth-client');

describe('A withWebId wrapper', () => {
  const Wrapper = withWebId(() => <span>contents</span>);
  let wrapper, setSession;

  beforeAll(() => {
    auth.trackSession.mockImplementationOnce(cb => (setSession = cb));
    wrapper = mount(<Wrapper foo="bar"/>);
  });
  beforeEach(() => wrapper.update());

  describe('before a session is received', () => {
    it('renders the wrapped component', () => {
      expect(wrapper.html()).toBe('<span>contents</span>');
    });

    it('passes a webID of null to the wrapped component', () => {
      expect(wrapper.childAt(0).props()).toHaveProperty('webId', null);
    });

    it('passes properties to the wrapped component', () => {
      expect(wrapper.childAt(0).props()).toHaveProperty('foo', 'bar');
    });
  });

  describe('when the user is not logged in', () => {
    beforeAll(() => setSession(null));

    it('renders the wrapped component', () => {
      expect(wrapper.html()).toBe('<span>contents</span>');
    });

    it('passes a webID of null to the wrapped component', () => {
      expect(wrapper.childAt(0).props()).toHaveProperty('webId', null);
    });

    it('passes properties to the wrapped component', () => {
      expect(wrapper.childAt(0).props()).toHaveProperty('foo', 'bar');
    });
  });

  describe('when the user is logged in', () => {
    beforeAll(() => setSession({ webId: 'https://example.org/#me' }));

    it('renders the wrapped component', () => {
      expect(wrapper.html()).toBe('<span>contents</span>');
    });

    it("passes the user's webID to the wrapped component", () => {
      expect(wrapper.childAt(0).props()).toHaveProperty('webId', 'https://example.org/#me');
    });

    it('passes properties to the wrapped component', () => {
      expect(wrapper.childAt(0).props()).toHaveProperty('foo', 'bar');
    });
  });

  describe('when the component unmounts', () => {
    let listener;
    beforeEach(() => {
      listener = wrapper.first().instance()._tracker;
      wrapper.unmount();
    });

    it('removes the session listener', () => {
      expect(auth.removeListener).toHaveBeenCalledTimes(1);
      expect(auth.removeListener).toHaveBeenLastCalledWith('session', listener);
    });
  });
});

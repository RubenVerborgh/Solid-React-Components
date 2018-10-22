import React from 'react';
import { withWebId } from '../../src/';
import { mount } from 'enzyme';
import auth from 'solid-auth-client';

describe('A withWebId wrapper', () => {
  const Wrapper = withWebId(() => <span>contents</span>);
  let wrapper;

  beforeAll(() => (wrapper = mount(<Wrapper foo="bar"/>)));
  beforeEach(() => wrapper.update());
  afterAll(() => wrapper.unmount());

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
    beforeAll(() => auth.mockWebId(null));

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
    beforeAll(() => auth.mockWebId('https://example.org/#me'));

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
});

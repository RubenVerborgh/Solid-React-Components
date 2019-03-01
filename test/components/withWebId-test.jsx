import React from 'react';
import { withWebId } from '../../src/';
import { render, cleanup } from 'react-testing-library';
import auth from 'solid-auth-client';

describe('A withWebId wrapper', () => {
  let container;

  beforeAll(() => {
    const Wrapper = withWebId(({ foo, webId }) =>
      <span data-foo={foo} data-webid={`${webId}`}>contents</span>);
    ({ container } = render(<Wrapper foo="bar"/>));
  });
  afterAll(cleanup);

  describe('before a session is received', () => {
    it('renders the wrapped component', () => {
      expect(container).toHaveTextContent('contents');
    });

    it('passes a webID of undefined to the wrapped component', () => {
      expect(container.firstChild).toHaveAttribute('data-webId', 'undefined');
    });

    it('passes properties to the wrapped component', () => {
      expect(container.firstChild).toHaveAttribute('data-foo', 'bar');
    });
  });

  describe('when the user is not logged in', () => {
    beforeAll(() => auth.mockWebId(null));

    it('renders the wrapped component', () => {
      expect(container).toHaveTextContent('contents');
    });

    it('passes a webID of null to the wrapped component', () => {
      expect(container.firstChild).toHaveAttribute('data-webId', 'null');
    });

    it('passes properties to the wrapped component', () => {
      expect(container.firstChild).toHaveAttribute('data-foo', 'bar');
    });
  });

  describe('when the user is logged in', () => {
    const webId = 'https://example.org/#me';
    beforeAll(() => auth.mockWebId(webId));

    it('renders the wrapped component', () => {
      expect(container).toHaveTextContent('contents');
    });

    it("passes the user's webID to the wrapped component", () => {
      expect(container.firstChild).toHaveAttribute('data-webId', webId);
    });

    it('passes properties to the wrapped component', () => {
      expect(container.firstChild).toHaveAttribute('data-foo', 'bar');
    });
  });
});

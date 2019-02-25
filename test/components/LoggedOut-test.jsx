import React from 'react';
import { LoggedOut } from '../../src/';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import auth from 'solid-auth-client';

describe('A LoggedOut pane', () => {
  let pane;
  beforeEach(() => pane.update());

  describe('with children', () => {
    beforeAll(() => !act(() => {
      pane = mount(<LoggedOut>Logged out</LoggedOut>);
    }));
    afterAll(() => pane.unmount());

    describe('when the user is not logged in', () => {
      beforeAll(() => !act(() => {
        auth.mockWebId(null);
      }));

      it('renders the content', () => {
        expect(pane.debug()).toMatch(/Logged out/);
      });
    });

    describe('when the user is logged in', () => {
      beforeAll(() => !act(() => {
        auth.mockWebId('https://example.org/#me');
      }));

      it('is empty', () => {
        expect(pane.debug()).toBe('<LoggedOut />');
      });
    });
  });

  describe('without children', () => {
    beforeAll(() => !act(() => {
      pane = mount(<LoggedOut/>);
    }));
    afterAll(() => pane.unmount());

    describe('when the user is not logged in', () => {
      beforeAll(() => !act(() => {
        auth.mockWebId(null);
      }));

      it('is empty', () => {
        expect(pane.debug()).toBe('<LoggedOut />');
      });
    });
  });
});

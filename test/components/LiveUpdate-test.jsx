import React, { useContext } from 'react';
import { LiveUpdate } from '../../src/';
import { UpdateContext, useLatestUpdate } from '../../src/';
import { render, cleanup } from 'react-testing-library';

jest.mock('../../src/hooks/useLatestUpdate', () => require('../__mocks__/useLatestUpdate'));

function ShowContext() {
  const context = useContext(UpdateContext);
  return JSON.stringify(context);
}

describe('a LiveUpdate component', () => {
  let container;
  afterAll(cleanup);

  describe('without children', () => {
    beforeAll(() => {
      ({ container } = render(<LiveUpdate/>));
    });

    it('renders an empty string', () => {
      expect(container.innerHTML).toBe('');
    });
  });

  describe('without a subscribe attribute', () => {
    beforeAll(() => {
      useLatestUpdate.mockClear();
      ({ container } = render(
        <LiveUpdate>
          <ShowContext/>
        </LiveUpdate>
      ));
    });

    it('calls useLatestUpdate with the * parameter', () => {
      expect(useLatestUpdate).toHaveBeenCalledTimes(1);
      expect(useLatestUpdate).toHaveBeenCalledWith('*');
    });

    it('initially sets the UpdateContext value to the empty object', () => {
      expect(container.innerHTML).toBe('{}');
    });

    it('changes the UpdateContext value when an update arrives', () => {
      useLatestUpdate.set({ update: true });
      expect(container.innerHTML).toBe('{"update":true}');
    });
  });

  describe('with an array as subscribe attribute', () => {
    beforeAll(() => {
      useLatestUpdate.mockClear();
      ({ container } = render(
        <LiveUpdate subscribe={['https://a.com/1', 'https://b.com/2']}>
          <ShowContext/>
        </LiveUpdate>
      ));
    });

    it('calls useLatestUpdate with the given resources', () => {
      expect(useLatestUpdate).toHaveBeenCalledTimes(1);
      expect(useLatestUpdate).toHaveBeenCalledWith('https://a.com/1', 'https://b.com/2');
    });

    it('initially sets the UpdateContext value to the empty object', () => {
      expect(container.innerHTML).toBe('{}');
    });

    it('changes the UpdateContext value when an update arrives', () => {
      useLatestUpdate.set({ update: true });
      expect(container.innerHTML).toBe('{"update":true}');
    });
  });

  describe('with an empty string as subscribe attribute', () => {
    beforeAll(() => {
      useLatestUpdate.mockClear();
      ({ container } = render(
        <LiveUpdate subscribe=" ">
          <ShowContext/>
        </LiveUpdate>
      ));
    });

    it('calls useLatestUpdate without parameters', () => {
      expect(useLatestUpdate).toHaveBeenCalledTimes(1);
      expect(useLatestUpdate).toHaveBeenCalledWith();
    });
  });

  describe('with a non-empty string as subscribe attribute', () => {
    beforeAll(() => {
      useLatestUpdate.mockClear();
      ({ container } = render(
        <LiveUpdate subscribe=" https://a.com/1  https://b.com/2  ">
          <ShowContext/>
        </LiveUpdate>
      ));
    });

    it('calls useLatestUpdate with the given resources', () => {
      expect(useLatestUpdate).toHaveBeenCalledTimes(1);
      expect(useLatestUpdate).toHaveBeenCalledWith('https://a.com/1', 'https://b.com/2');
    });
  });
});

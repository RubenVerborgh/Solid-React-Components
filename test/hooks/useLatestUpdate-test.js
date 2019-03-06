import { useLatestUpdate } from '../../src/';
import UpdateTracker from '../../src/UpdateTracker';
import { renderHook, act, cleanup } from 'react-hooks-testing-library';

jest.mock('../../src/UpdateTracker', () =>
  jest.fn(() => ({
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
  }))
);

describe('useLatestUpdate', () => {
  const resources = [
    'http://a.com/docs/1',
    'http://b.com/docs/2',
  ];
  let result, unmount, rerender;
  beforeAll(() => {
    ({ result, unmount, rerender } = renderHook(
      ({ args }) => useLatestUpdate(...args),
      { initialProps: { args: resources } }));
  });
  afterAll(cleanup);

  it('initially returns the empty object', () => {
    expect(result.current).toEqual({});
  });

  it('creates an UpdateTracker with a callback', () => {
    expect(UpdateTracker).toHaveBeenCalledTimes(1);
    const callback = UpdateTracker.mock.calls[0][0];
    expect(callback).toBeInstanceOf(Function);
  });

  it('subscribes to the resources', () => {
    const updateTracker = UpdateTracker.mock.results[0].value;
    expect(updateTracker.subscribe).toHaveBeenCalledTimes(1);
    expect(updateTracker.subscribe).toHaveBeenCalledWith(...resources);
  });

  describe('when an update arrives', () => {
    const update = { update: true };
    beforeAll(() => {
      const callback = UpdateTracker.mock.calls[0][0];
      act(() => callback(update));
    });

    it('returns the updated value', () => {
      expect(result.current).toBe(update);
    });
  });

  describe('when unmounted', () => {
    beforeAll(() => {
      unmount();
    });

    it('unsubscribes from the resources', () => {
      const updateTracker = UpdateTracker.mock.results[0].value;
      expect(updateTracker.unsubscribe).toHaveBeenCalledTimes(1);
      expect(updateTracker.unsubscribe).toHaveBeenCalledWith(...resources);
    });
  });

  describe('when called with different arguments', () => {
    const others = [
      'http://a.com/docs/1',
      'http://b.com/docs/3',
    ];
    beforeAll(() => {
      rerender({ args: others });
    });

    it('unsubscribes from the old resources', () => {
      const updateTracker = UpdateTracker.mock.results[0].value;
      expect(updateTracker.unsubscribe).toHaveBeenCalledTimes(1);
      expect(updateTracker.unsubscribe).toHaveBeenCalledWith(...resources);
    });

    it('subscribes to the new resources', () => {
      expect(UpdateTracker).toHaveBeenCalledTimes(2);
      const updateTracker = UpdateTracker.mock.results[1].value;
      expect(updateTracker.subscribe).toHaveBeenCalledTimes(1);
      expect(updateTracker.subscribe).toHaveBeenCalledWith(...others);
    });
  });
});

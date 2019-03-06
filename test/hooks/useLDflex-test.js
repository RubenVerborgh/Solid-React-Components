import { useLDflex } from '../../src/';
import { useLiveUpdate } from '../../src/';
import { toString } from '../../src/hooks/useLDflex';
import { act, renderHook, cleanup } from 'react-hooks-testing-library';
import ExpressionEvaluator from '../../src/ExpressionEvaluator';
import auth from 'solid-auth-client';

const evaluator = ExpressionEvaluator.prototype;
evaluator.evaluate = jest.fn();
jest.spyOn(evaluator, 'destroy');

jest.mock('../../src/hooks/useLiveUpdate', () => require('../__mocks__/useLatestUpdate'));

describe('useLDflex', () => {
  beforeEach(jest.clearAllMocks);
  afterEach(cleanup);

  it('destroys the evaluator after unmounting', () => {
    const { unmount } = renderHook(() => useLDflex());
    unmount();
    expect(evaluator.destroy).toHaveBeenCalledTimes(1);
  });

  it('resolves a value expression', () => {
    const { result } = renderHook(() => useLDflex('foo'));
    expect(result.current).toEqual([undefined, true, undefined]);
    expect(evaluator.evaluate).toHaveBeenCalledTimes(1);
    expect(evaluator.evaluate.mock.calls[0][0]).toEqual({ result: 'foo' });
    expect(evaluator.evaluate.mock.calls[0][1]).toEqual({});

    const callback = evaluator.evaluate.mock.calls[0][2];
    act(() => callback({ result: 'bar', pending: false, error: undefined }));
    expect(result.current).toEqual(['bar', false, undefined]);
  });

  it('resolves a list expression', () => {
    const { result } = renderHook(() => useLDflex('foo', true));
    expect(result.current).toEqual([[], true, undefined]);
    expect(evaluator.evaluate).toHaveBeenCalledTimes(1);
    expect(evaluator.evaluate.mock.calls[0][0]).toEqual({});
    expect(evaluator.evaluate.mock.calls[0][1]).toEqual({ result: 'foo' });

    const callback = evaluator.evaluate.mock.calls[0][2];
    act(() => callback({ result: [1, 2, 3], pending: false, error: undefined }));
    expect(result.current).toEqual([[1, 2, 3], false, undefined]);
  });

  it('re-evaluates a string expression when a user logs in', () => {
    renderHook(() => useLDflex('foo', true));
    evaluator.evaluate.mockClear();
    auth.mockWebId('https://example.org/profile#me');
    expect(evaluator.evaluate).toHaveBeenCalledTimes(1);
  });

  it('does not re-evaluate a Promise when a user logs in', () => {
    renderHook(() => useLDflex(Promise.resolve(), true));
    evaluator.evaluate.mockClear();
    auth.mockWebId('https://example.org/profile#me');
    expect(evaluator.evaluate).toHaveBeenCalledTimes(0);
  });

  it('re-evaluates when the UpdateContext changes', () => {
    renderHook(() => useLDflex('foo', true));
    evaluator.evaluate.mockClear();
    useLiveUpdate.set({ other: true });
    expect(evaluator.evaluate).toHaveBeenCalledTimes(1);
  });
});

describe('toString', () => {
  it('converts objects to strings', () => {
    expect(toString({ toString: () => 'foo' })).toBe('foo');
  });

  it('converts arrays to an array of strings', () => {
    expect(toString([1, 2])).toEqual(['1', '2']);
  });
});

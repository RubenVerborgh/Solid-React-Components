import { useLDflexValue } from '../../src/';
import { act, renderHook, cleanup } from '@testing-library/react-hooks';
import ExpressionEvaluator from '../../src/ExpressionEvaluator';

const evaluator = ExpressionEvaluator.prototype;
evaluator.evaluate = jest.fn();
jest.spyOn(evaluator, 'destroy');

describe('useLDflexValue', () => {
  beforeEach(jest.clearAllMocks);
  afterEach(cleanup);

  it('destroys the evaluator after unmounting', () => {
    const { unmount } = renderHook(() => useLDflexValue());
    unmount();
    expect(evaluator.destroy).toHaveBeenCalledTimes(1);
  });

  it('resolves a value expression', () => {
    const { result } = renderHook(() => useLDflexValue('foo'));
    expect(result.current).toEqual(undefined);
    expect(evaluator.evaluate).toHaveBeenCalledTimes(1);
    expect(evaluator.evaluate.mock.calls[0][0]).toEqual({ result: 'foo' });
    expect(evaluator.evaluate.mock.calls[0][1]).toEqual({});

    const callback = evaluator.evaluate.mock.calls[0][2];
    act(() => callback({ result: 'bar', pending: false, error: undefined }));
    expect(result.current).toEqual('bar');
  });
});

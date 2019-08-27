import { useLDflexList } from '../../src/';
import { act, renderHook, cleanup } from '@testing-library/react-hooks';
import ExpressionEvaluator from '../../src/ExpressionEvaluator';

const evaluator = ExpressionEvaluator.prototype;
evaluator.evaluate = jest.fn();
jest.spyOn(evaluator, 'destroy');

describe('useLDflexList', () => {
  beforeEach(jest.clearAllMocks);
  afterEach(cleanup);

  it('destroys the evaluator after unmounting', () => {
    const { unmount } = renderHook(() => useLDflexList());
    unmount();
    expect(evaluator.destroy).toHaveBeenCalledTimes(1);
  });

  it('resolves a list expression', () => {
    const { result } = renderHook(() => useLDflexList('foo'));
    expect(result.current).toEqual([]);
    expect(evaluator.evaluate).toHaveBeenCalledTimes(1);
    expect(evaluator.evaluate.mock.calls[0][0]).toEqual({});
    expect(evaluator.evaluate.mock.calls[0][1]).toEqual({ result: 'foo' });

    const callback = evaluator.evaluate.mock.calls[0][2];
    act(() => callback({ result: [1, 2, 3], pending: false, error: undefined }));
    expect(result.current).toEqual([1, 2, 3]);
  });
});

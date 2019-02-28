import ExpressionEvaluator from '../src/ExpressionEvaluator';
import MockPromise from 'jest-mock-promise';
import data from '@solid/query-ldflex';

jest.useFakeTimers();

describe('An ExpressionEvaluator', () => {
  let result;
  beforeEach(() => {
    result = new MockPromise();
    data.resolve.mockReturnValueOnce(result);
  });

  it('evaluates a single value', async () => {
    const evaluator = new ExpressionEvaluator();
    const callback = jest.fn();

    // Start evaluating the expression
    const done = evaluator.evaluate({ foo: 'foo.expression' }, {}, callback);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith(
      { error: undefined, foo: undefined, pending: true });
    expect(data.resolve).toHaveBeenCalledTimes(1);
    expect(data.resolve).toHaveBeenLastCalledWith('foo.expression');
    jest.runAllTimers();

    // Resolve the expression
    await result.resolve('foo-value');
    await new Promise(resolve => resolve());

    // Answer is served
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith({ foo: 'foo-value' });
    await done;
  });

  it('stops the evaluation when destroyed', async () => {
    const evaluator = new ExpressionEvaluator();
    const callback = jest.fn();

    // Start evaluating the expression
    const done = evaluator.evaluate({ foo: 'foo.expression' }, {}, callback);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith(
      { error: undefined, foo: undefined, pending: true });
    jest.runAllTimers();

    // Resolve the expression
    result.resolve('foo-value');
    evaluator.destroy();
    await new Promise(resolve => resolve());

    // No answer is served
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith(
      { error: undefined, foo: undefined, pending: true });
    await done;
  });
});

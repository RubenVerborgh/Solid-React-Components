import { createTaskQueue } from './util';
import data from '@solid/query-ldflex';

const evaluatorQueue = createTaskQueue();

/**
 * Evaluates a map of LDflex expressions into a singular value or a list.
 * Expressions can be changed and/or re-evaluated.
 */
export default class ExpressionEvaluator {
  pending = {};
  cancel = false;

  /** Stops all pending and future evaluations */
  destroy() {
    this.pending = {};
    this.cancel = true;
    evaluatorQueue.clear(this);
  }

  /** Evaluates the given singular value and list expressions. */
  async evaluate(values, lists, updateCallback) {
    // Create evaluators for each expression, and mark them as pending
    const reset = { error: undefined, pending: true };
    const evaluators = evaluatorQueue.schedule([
      ...Object.entries(values).map(([key, expr]) => {
        reset[key] = undefined;
        return () => this.evaluateAsValue(key, expr, updateCallback);
      }),
      ...Object.entries(lists).map(([key, expr]) => {
        reset[key] = [];
        return () => this.evaluateAsList(key, expr, updateCallback);
      }),
    ], this);
    updateCallback(reset);

    // Wait until all evaluators are done (or one of them errors)
    try {
      await Promise.all(evaluators);
    }
    catch (error) {
      updateCallback({ error });
    }

    // Update the pending flag if all evaluators wrote their value or errored,
    // and if no new evaluators are pending
    const statuses = await Promise.all(evaluators.map(e => e.catch(error => {
      console.warn('@solid/react-components', 'Expression evaluation failed.', error);
      return true;
    })));
    // Stop if results are no longer needed
    if (this.cancel)
      return;
    // Reset the pending flag if all are done and no others are pending
    if (!statuses.some(done => !done) && Object.keys(this.pending).length === 0)
      updateCallback({ pending: false });
  }

  /** Evaluates the property expression as a singular value. */
  async evaluateAsValue(key, expr, updateCallback) {
    // Obtain and await the promise
    const promise = this.resolveExpression(key, expr, 'then');
    this.pending[key] = promise;
    try {
      const value = await promise;
      // Stop if another evaluator took over in the meantime (component update)
      if (this.pending[key] !== promise)
        return false;
      updateCallback({ [key]: value });
    }
    // Ensure the evaluator is removed, even in case of errors
    finally {
      if (this.pending[key] === promise)
        delete this.pending[key];
    }
    return true;
  }

  /** Evaluates the property expression as a list. */
  async evaluateAsList(key, expr, updateCallback) {
    // Create the iterable
    const iterable = this.resolveExpression(key, expr, Symbol.asyncIterator);
    if (!iterable)
      return true;
    this.pending[key] = iterable;

    // Read the iterable
    const items = [];
    const update = () => !this.cancel && updateCallback({ [key]: [...items] });
    const itemQueue = createTaskQueue({ timeBetween: 100, drop: true });
    try {
      for await (const item of iterable) {
        // Stop if another evaluator took over in the meantime (component update)
        if (this.pending[key] !== iterable)
          return false;
        items.push(item);
        itemQueue.schedule(update);
      }
    }
    // Ensure pending updates are applied, and the evaluator is removed
    finally {
      const needsUpdate = itemQueue.clear();
      if (this.pending[key] === iterable) {
        if (needsUpdate)
          update();
        delete this.pending[key];
      }
    }
    return true;
  }

  /** Resolves the property into an LDflex path. */
  resolveExpression(key, expr, expectedProperty) {
    // If the property is an LDflex string expression, resolve it
    if (!expr)
      return '';
    const resolved = typeof expr === 'string' ? data.resolve(expr) : expr;

    // Ensure that the resolved value is an LDflex path
    if (!resolved || typeof resolved[expectedProperty] !== 'function')
      throw new Error(`${key} should be an LDflex path or string but is ${expr}`);

    return resolved;
  }
}

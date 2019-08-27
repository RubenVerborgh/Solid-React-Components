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
    // Reset the pending status and clear any errors
    updateCallback({ pending: true, error: undefined });

    // Create evaluators for each expression, and mark them as pending
    const evaluators = evaluatorQueue.schedule([
      ...Object.entries(values).map(([key, expr]) =>
        () => this.evaluateAsValue(key, expr, updateCallback)),
      ...Object.entries(lists).map(([key, expr]) =>
        () => this.evaluateAsList(key, expr, updateCallback)),
    ], this);

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
    const promise = this.pending[key] = this.resolveExpression(expr);
    let value;
    try {
      value = await promise;
      // Stop if another evaluator took over in the meantime (component update)
      if (this.pending[key] !== promise)
        return false;
    }
    // Update the result and remove the evaluator, even in case of errors
    finally {
      if (this.pending[key] === promise) {
        delete this.pending[key];
        updateCallback({ [key]: value });
      }
    }
    return true;
  }

  /** Evaluates the property expression as a list. */
  async evaluateAsList(key, expr, updateCallback) {
    // Read the iterable's items, throttling updates to avoid congestion
    let empty = true;
    const items = [];
    const iterable = this.pending[key] = this.resolveExpression(expr);
    const update = () => !this.cancel && updateCallback({ [key]: [...items] });
    const updateQueue = createTaskQueue({ timeBetween: 100, drop: true });
    try {
      for await (const item of iterable) {
        // Stop if another evaluator took over in the meantime (component update)
        if (this.pending[key] !== iterable) {
          updateQueue.clear();
          return false;
        }
        // Add the item and schedule an update
        empty = false;
        items.push(item);
        updateQueue.schedule(update);
      }
    }
    // Ensure pending updates are applied immediately, and the evaluator is removed
    finally {
      const needsUpdate = empty || updateQueue.clear();
      if (this.pending[key] === iterable) {
        delete this.pending[key];
        if (needsUpdate)
          update();
      }
    }
    return true;
  }

  /** Resolves the expression into an LDflex path. */
  resolveExpression(expr) {
    // Ignore an empty expression
    if (!expr)
      return '';
    // Resolve an LDflex string expression
    else if (typeof expr === 'string')
      return data.resolve(expr);
    // Return a resolved LDflex path (and any other object) as-is
    else
      return expr;
  }
}

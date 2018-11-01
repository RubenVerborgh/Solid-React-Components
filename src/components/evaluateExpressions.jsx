import React from 'react';
import withWebId from './withWebId';
import { getDisplayName, createTaskQueue } from '../util';
import data from '@solid/query-ldflex';

const evaluatorQueue = createTaskQueue();

/**
 * Higher-order component that evaluates LDflex expressions in properties
 * and passes their results to the wrapped component.
 */
export default function evaluateExpressions(valueProps, listProps, Component) {
  // Shift the optional listProps parameter when not specified
  if (!Component) {
    Component = listProps;
    listProps = [];
  }

  class EvaluateExpressions extends React.Component {
    static displayName = `EvaluateExpressions(${getDisplayName(Component)})`;

    constructor(props) {
      super(props);
      this.state = { pending: true };
      this.pending = {};
      this.cancel = false;

      this.valueProps = valueProps || [];
      this.valueProps.forEach(p => (this.state[p] = undefined));

      this.listProps = listProps || [];
      this.listProps.forEach(p => (this.state[p] = []));
    }

    componentDidMount() {
      this.evaluateExpressions(this.valueProps, this.listProps);
    }

    componentDidUpdate(prevProps) {
      // A property needs to be re-evaluated if it changed
      // or, if it is a string expression, when the user has changed
      // (which might influence the expression's evaluation).
      const userChanged = this.props.webId !== prevProps.webId;
      const propChanged = name =>
        this.props[name] !== prevProps[name] ||
          (userChanged && typeof this.props[name] === 'string');

      // Re-evaluate changed singular values and lists
      const changedValues = this.valueProps.filter(propChanged);
      const changedLists = this.listProps.filter(propChanged);
      if (changedValues.length > 0 || changedLists.length > 0)
        this.evaluateExpressions(changedValues, changedLists);
    }

    componentWillUnmount() {
      // Avoid state updates from pending evaluators
      this.pending = {};
      this.cancel = true;
      evaluatorQueue.clear(this);
    }

    /** Evaluates the property expressions into the state. */
    async evaluateExpressions(values, lists) {
      // Create evaluators for each property, and mark them as pending
      const pendingState = { pending: true };
      const evaluators = evaluatorQueue.schedule([
        ...values.map(name => {
          pendingState[name] = undefined;
          return () => this.evaluateValueExpression(name);
        }),
        ...lists.map(name => {
          pendingState[name] = [];
          return () => this.evaluateListExpression(name);
        }),
      ], this);
      this.setState(pendingState);

      // Wait until all evaluators are done (or one of them errors)
      try {
        await Promise.all(evaluators);
      }
      catch (error) {
        this.setState({ error });
      }

      // Update the pending flag if all evaluators wrote their value or errored,
      // and if no new evaluators are pending
      const statuses = await Promise.all(evaluators.map(e => e.catch(error => {
        console.warn('@solid/react-components', 'Expression evaluation failed.', error);
        return true;
      })));
      // Stop if results are no longer needed (e.g., unmounted)
      if (this.cancel)
        return;
      // Reset the pending state if all are done and no others are pending
      if (!statuses.some(done => !done) && Object.keys(this.pending).length === 0)
        this.setState({ pending: false });
    }

    /** Evaluates the property expression as a singular value. */
    async evaluateValueExpression(name) {
      // Obtain and await the promise
      const promise = this.resolveExpression(name, 'then');
      this.pending[name] = promise;
      try {
        const value = await promise;
        // Stop if another evaluator took over in the meantime (component update)
        if (this.pending[name] !== promise)
          return false;
        this.setState({ [name]: value });
      }
      // Ensure the evaluator is removed, even in case of errors
      finally {
        if (this.pending[name] === promise)
          delete this.pending[name];
      }
      return true;
    }

    /** Evaluates the property expression as a list. */
    async evaluateListExpression(name) {
      // Create the iterable
      const iterable = this.resolveExpression(name, Symbol.asyncIterator);
      if (!iterable)
        return true;
      this.pending[name] = iterable;

      // Read the iterable
      const items = [];
      const update = () => this.cancel || this.setState({ [name]: [...items] });
      const stateQueue = createTaskQueue({ timeBetween: 100, drop: true });
      try {
        for await (const item of iterable) {
          // Stop if another evaluator took over in the meantime (component update)
          if (this.pending[name] !== iterable)
            return false;
          items.push(item);
          stateQueue.schedule(update);
        }
      }
      // Ensure pending updates are applied, and the evaluator is removed
      finally {
        const needsUpdate = stateQueue.clear();
        if (this.pending[name] === iterable) {
          if (needsUpdate)
            update();
          delete this.pending[name];
        }
      }
      return true;
    }

    /** Resolves the property into an LDflex path. */
    resolveExpression(name, expectedProperty) {
      // If the property is an LDflex string expression, resolve it
      const expr = this.props[name];
      if (!expr)
        return '';
      const resolved = typeof expr === 'string' ? data.resolve(expr) : expr;

      // Ensure that the resolved value is an LDflex path
      if (!resolved || typeof resolved[expectedProperty] !== 'function')
        throw new Error(`${name} should be an LDflex path or string but is ${expr}`);

      return resolved;
    }

    render() {
      return <Component {...this.props} {...this.state} />;
    }
  }
  return withWebId(EvaluateExpressions);
}

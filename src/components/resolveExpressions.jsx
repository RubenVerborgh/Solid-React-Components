import React from 'react';
import withWebId from './withWebId';
import * as ldflex from '@solid/query-ldflex';

/**
 * Higher-order component that evaluates LDflex expressions in properties
 * and passes their results to the wrapped component.
 */
export default function resolveExpressions(propsToResolve, WrappedComponent) {
  class ResolveExpressions extends React.Component {
    constructor(props) {
      super(props);
      this.state = { pending: true };
      this.propsToResolve = propsToResolve;
    }

    componentDidMount() {
      this.loadData();
    }

    componentDidUpdate({ data, webId }) {
      // Reload when the data property changes
      // or, if it is a string expression, when the user changes
      // (which might influence the expression's evaluation).
      if (this.props.data !== data ||
          (typeof data === 'string' && this.props.webId !== webId))
        // Wait for a change of user to propagate to the expression engine
        setImmediate(() => this.loadData());
    }

    /** Resolves the promise to data into the state. */
    async loadData() {
      let data = this.props.data, value = null, error = null;
      try {
        // If the data is a string expression, evaluate it
        if (typeof data === 'string')
          data = this.evaluateExpression(data);

        // Ensure that data is a thenable
        if (!data || typeof data.then !== 'function')
          throw new Error(`Expected data to be a path or a string but got ${data}`);

        // Await the data
        this.setState({ pending: true });
        value = await data;
      }
      catch ({ message }) {
        error = message;
      }
      this.setState({ value, error, pending: false });
    }

    /** Evaluates the given string expression against Solid LDflex. */
    evaluateExpression(expression) {
      const body = `"use strict";return solid.data.${expression}`;
      let evaluator;
      try {
        /* eslint no-new-func: off */
        evaluator = Function('solid', body);
      }
      catch ({ message }) {
        throw new Error(`Expression "${expression}" is invalid: ${message}`);
      }
      return evaluator({ data: ldflex });
    }

    render() {
      const { pending, error, value } = this.state;
      return <WrappedComponent pending={pending} error={error} value={value}
        {...this.props} />;
    }
  }
  return withWebId(ResolveExpressions);
}

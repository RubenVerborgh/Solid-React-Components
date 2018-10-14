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
      this.resolveExpressions();
    }

    componentDidUpdate(prevProps) {
      // Reload when any resolving property has changed
      // or, if it is a string expression, when the user has changed
      // (which might influence the expression's evaluation).
      const userChanged = this.props.webId !== prevProps.webId;
      const changed = this.propsToResolve.some(p =>
        this.props[p] !== prevProps[p] ||
          (userChanged && typeof this.props[p] === 'string')
      );
      // Wait for a change of user to propagate to the expression engine
      if (changed)
        setImmediate(() => this.resolveExpressions());
    }

    /** Resolves all property expressions into the state. */
    async resolveExpressions() {
      this.setState(() => ({ pending: true }));
      const resolvers = this.propsToResolve.map(p => this.resolveExpression(p));
      try {
        await Promise.all(resolvers);
      }
      catch (error) {
        this.setState({ error });
      }
      this.setState({ pending: false });
    }

    /** Resolves the property expression into the state. */
    async resolveExpression(name) {
      // If the property is a string expression, evaluate it
      const expression = this.props[name];
      const value = typeof expression === 'string' ?
        this.evaluateExpression(expression) : expression;

      // Ensure that the value is a thenable
      if (!value || typeof value.then !== 'function')
        throw new Error(`Expected ${name} to be a path or a string but got ${expression}`);

      // Await the value and add it to the state
      const resolved = await value;
      this.setState({ [name]: resolved });
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
      // Copy relevant state and existing properties
      const { pending, error } = this.state;
      const props = Object.assign({ pending, error }, this.props);

      // Copy resolved properties
      for (const name of this.propsToResolve)
        props[name] = this.state[name];

      return <WrappedComponent {...props} />;
    }
  }
  return withWebId(ResolveExpressions);
}

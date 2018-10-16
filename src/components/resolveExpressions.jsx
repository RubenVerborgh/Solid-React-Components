import React from 'react';
import withWebId from './withWebId';
import { resolveLDflex } from '../util';

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
      this.resolveExpressions(this.propsToResolve);
    }

    componentDidUpdate(prevProps) {
      // Reload any resolving property that has changed
      // or, if it is a string expression, when the user has changed
      // (which might influence the expression's evaluation).
      const userChanged = this.props.webId !== prevProps.webId;
      const changedProps = this.propsToResolve.filter(p =>
        this.props[p] !== prevProps[p] ||
          (userChanged && typeof this.props[p] === 'string')
      );
      // Wait for a change of user to propagate to the expression engine
      if (changedProps.length > 0)
        setImmediate(() => this.resolveExpressions(changedProps));
    }

    /** Resolves the property expressions into the state. */
    async resolveExpressions(names) {
      // Mark the properties as pending
      const pendingState = { pending: true };
      names.forEach(n => (pendingState[n] = undefined));
      this.setState(pendingState);

      // Create resolvers for each property and wait until they are done
      const resolvers = names.map(p => this.resolveExpression(p));
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
      const expr = this.props[name];
      const value = typeof expr === 'string' ? resolveLDflex(expr) : expr;

      // Ensure that the value is a thenable
      if (!value || typeof value.then !== 'function')
        throw new Error(`Expected ${name} to be a path or a string but got ${expr}`);

      // Await the value and add it to the state
      const resolved = await value;
      this.setState({ [name]: resolved });
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

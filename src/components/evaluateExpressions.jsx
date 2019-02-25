import React from 'react';
import withWebId from './withWebId';
import ExpressionEvaluator from '../ExpressionEvaluator';
import { pick, getDisplayName } from '../util';

/**
 * Higher-order component that evaluates LDflex expressions in properties
 * and passes their results to the wrapped component.
 */
export default function evaluateExpressions(valueProps, listProps, Component) {
  // Shift the optional listProps parameter when not specified
  if (!Component)
    [Component, listProps] = [listProps, []];

  // Create the initial state for all Component instances
  const initialState = { pending: true };
  for (const name of valueProps || [])
    initialState[name] = undefined;
  for (const name of listProps || [])
    initialState[name] = [];

  // Create a higher-order component that wraps the given Component
  class EvaluateExpressions extends React.Component {
    static displayName = `EvaluateExpressions(${getDisplayName(Component)})`;

    state = initialState;

    componentDidMount() {
      this.evaluator = new ExpressionEvaluator();
      this.update = state => this.setState(state);
      this.evaluate(valueProps, listProps);
    }

    componentDidUpdate(prevProps) {
      // A property needs to be re-evaluated if it changed
      // or, if it is a string expression, when the user has changed
      // (which might influence the expression's evaluation).
      const newUser = this.props.webId !== prevProps.webId;
      const changed = name => this.props[name] !== prevProps[name] ||
          newUser && typeof this.props[name] === 'string';
      this.evaluate(valueProps.filter(changed), listProps.filter(changed));
    }

    componentWillUnmount() {
      this.evaluator.destroy();
    }

    render() {
      return <Component {...this.props} {...this.state} />;
    }

    evaluate(values, lists) {
      const { props, evaluator } = this;
      if (values.length > 0 || lists.length > 0)
        evaluator.evaluate(pick(props, values), pick(props, lists), this.update);
    }
  }
  return withWebId(EvaluateExpressions);
}

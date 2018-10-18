import evaluateExpressions from './evaluateExpressions';

/**
 * Higher-order component that evaluates an LDflex list expression in a property
 * and passes its items to the wrapped component.
 */
export default (propName, WrappedComponent) =>
  evaluateExpressions([], [propName], WrappedComponent);

import React from 'react';
import * as ldflex from '@solid/query-ldflex';

/** Displays the value of a Solid LDflex expression. */
export default class DataField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data)
      this.loadData();
  }

  /** Resolves the promise to data into the state. */
  async loadData() {
    let data = this.props.data;
    try {
      // If the data is a string expression, evaluate it
      if (typeof data === 'string')
        data = this.evaluateExpression(data);

      // Ensure that data is a thenable
      if (!data || typeof data.then !== 'function')
        throw new Error(`Expected data to be a path or a string but got ${data}`);

      // Await the data and store it into the state
      const value = await data;
      this.setState({ value });
    }
    catch ({ message: error }) {
      this.setState({ error });
    }
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
    const { value, error } = this.state;
    // Render error state
    if (error !== undefined)
      return <span className="solid data error" error={error}/>;
    // Render pending or empty state
    if (value === undefined)
      return <span className="solid data empty"/>;
    // Render stringified value
    return `${value}`;
  }
}

import React from 'react';

/** Displays the value of a Solid LDflex expression. */
export default class DataField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data)
      this.loadData();
  }

  /** Resolves the promise to data into the state. */
  async loadData() {
    try {
      const value = await this.props.data;
      this.setState({ value });
    }
    catch ({ message: error }) {
      this.setState({ error });
    }
  }

  render() {
    const { value, error } = this.state;
    // Render error state
    if (error !== undefined)
      return <span className="solid data error" error={error}/>;
    // Render pending state
    if (value === undefined)
      return <span className="solid data empty"/>;
    // Render stringified value
    return `${value}`;
  }
}

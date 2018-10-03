import React from 'react';
import auth from 'solid-auth-client';

/**
 * Higher-order component that passes the WebID of the logged-in user
 * to the webId property of the wrapped component.
 */
export default function withWebId(WrappedComponent) {
  return class WithWebID extends React.Component {
    constructor(props) {
      super(props);
      this.state = { webId: null };
      this._tracker = session => this.setState({ webId: session && session.webId });
    }

    componentDidMount() {
      auth.trackSession(this._tracker);
    }

    componentWillUnmount() {
      auth.removeListener('session', this._tracker);
    }

    render() {
      return <WrappedComponent webId={this.state.webId} {...this.props} />;
    }
  };
}

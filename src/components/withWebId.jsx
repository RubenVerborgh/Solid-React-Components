import React from 'react';
import auth from 'solid-auth-client';
import { getDisplayName } from '../util';

// Track all instances to inform them of WebID changes
const instances = new Set();
let authState = { webId: undefined };

/**
 * Higher-order component that passes the WebID of the logged-in user
 * to the webId property of the wrapped component.
 */
export default function withWebId(Component) {
  return class WithWebID extends React.Component {
    static displayName = `WithWebId(${getDisplayName(Component)})`;

    state = authState;

    componentDidMount() {
      instances.add(this);
    }

    componentWillUnmount() {
      instances.delete(this);
    }

    render() {
      return <Component webId={this.state.webId} {...this.props} />;
    }
  };
}

// Inform all instances when the WebID changes
auth.trackSession(session => {
  authState = { webId: session && session.webId };
  for (const instance of instances)
    instance.setState(authState);
});

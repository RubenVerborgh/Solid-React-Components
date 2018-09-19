import React from 'react';
import auth from 'solid-auth-client';

/**
 * Pane that shows different content
 * depending on whether the user is logged in or not.
 */
export default class LoginButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: false };
    auth.trackSession(session => this.setState({ loggedIn: !!session }));
  }

  render() {
    return (this.state.loggedIn ? this.props.loggedIn : this.props.loggedOut) || null;
  }
}

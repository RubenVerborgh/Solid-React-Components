import React from 'react';
import auth from 'solid-auth-client';

/**
 * Button that lets the user log in or out with Solid.
 */
export default class LoginButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: false };
    auth.trackSession(session => this.setState({ loggedIn: !!session }));
  }

  render() {
    return this.state.loggedIn ?
      <button className="solid logout" onClick={() => auth.logout()}>Log out</button> :
      <button className="solid login" onClick={() => auth.popupLogin()}>Log in</button>;
  }
}

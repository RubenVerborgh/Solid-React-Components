import React from 'react';
import withWebId from './withWebId';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

/** Button that lets the user log in or out with Solid.  */
export default withWebId(({ webId, ...props }) =>
  webId ? <LogoutButton {...props}/> : <LoginButton {...props}/>);

import React from 'react';
import withWebId from './withWebId';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

/** Button that lets the user log in or out with Solid.  */
const AuthButton = withWebId(function AuthButton({ webId, ...props }) {
  return webId ? <LogoutButton {...props}/> : <LoginButton {...props}/>;
});
export default AuthButton;

AuthButton.propTypes = Object.assign({},
  LoginButton.propTypes, LogoutButton.propTypes);

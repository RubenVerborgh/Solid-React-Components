import React from 'react';
import withWebId from './withWebId';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

/** Button that lets the user log in or out with Solid.  */
export default withWebId(function AuthButton({ webId, login, logout, ...props }) {
  return webId ?
    <LogoutButton {...props}>{logout}</LogoutButton> :
    <LoginButton {...props}>{login}</LoginButton>;
});

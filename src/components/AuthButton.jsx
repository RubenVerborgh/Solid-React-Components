import React from 'react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import useLoggedIn from '../hooks/useLoggedIn';

/** Button that lets the user log in or out with Solid.  */
export default function AuthButton({ login, logout, ...props }) {
  return useLoggedIn() ?
    <LogoutButton {...props}>{logout}</LogoutButton> :
    <LoginButton {...props}>{login}</LoginButton>;
}

import React from 'react';
import auth from 'solid-auth-client';

/** Button that lets the user log in with Solid. */
export default function LoginButton({ popup, className = 'solid auth login' }) {
  return <button
    className={className}
    onClick={() => auth.popupLogin({ popupUri: popup })}>Log in</button>;
}

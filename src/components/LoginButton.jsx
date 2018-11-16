import React from 'react';
import auth from 'solid-auth-client';

/** Button that lets the user log in with Solid. */
export default function LoginButton({ popup, className }) {
  return <button
    className={`solid auth login ${className}`}
    onClick={() => auth.popupLogin({ popupUri: popup })}>Log in</button>;
}

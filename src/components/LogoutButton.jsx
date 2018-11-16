import React from 'react';
import auth from 'solid-auth-client';

/** Button that lets the user log out with Solid. */
export default function LogoutButton({ className = 'solid auth logout' }) {
  return <button
    className={className}
    onClick={() => auth.logout()}>Log out</button>;
}

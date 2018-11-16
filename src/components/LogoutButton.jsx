import React from 'react';
import auth from 'solid-auth-client';

/** Button that lets the user log out with Solid. */
export default function LogoutButton({ className }) {
  return <button
    className={`solid auth logout ${className}`}
    onClick={() => auth.logout()}>Log out</button>;
}

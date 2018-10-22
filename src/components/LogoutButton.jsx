import React from 'react';
import auth from 'solid-auth-client';

/** Button that lets the user log out with Solid. */
export default function LogoutButton() {
  return <button
    className="solid auth logout"
    onClick={() => auth.logout()}>Log out</button>;
}

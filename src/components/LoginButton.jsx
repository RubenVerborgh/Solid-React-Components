import React from 'react';
import auth from 'solid-auth-client';

/** Button that lets the user log in with Solid. */
export default ({ popup }) =>
  <button
    className="solid auth login"
    onClick={() => auth.popupLogin({ popupUri: popup })}>Log in</button>;

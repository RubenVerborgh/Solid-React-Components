import React from 'react';
import PropTypes from './prop-types';
import auth from 'solid-auth-client';

/** Button that lets the user log in with Solid. */
export default function LoginButton({ popup }) {
  return <button
    className="solid auth login"
    onClick={() => auth.popupLogin({ popupUri: popup })}>Log in</button>;
}

LoginButton.propTypes = {
  popup: PropTypes.string,
};

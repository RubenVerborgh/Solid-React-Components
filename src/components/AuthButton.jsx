import React from 'react';
import { AuthPane, LoginButton, LogoutButton } from '..';

/** Button that lets the user log in or out with Solid.  */
export default props =>
  <AuthPane
    loggedIn={<LogoutButton {...props}/>}
    loggedOut={<LoginButton {...props}/>} />;

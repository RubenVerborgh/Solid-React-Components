import React from 'react';
import { AuthButton, LoggedInPane, LoggedOutPane } from '../src/';

export default () =>
  <div>
    <h1>Solid App</h1>
    <AuthButton popup="popup.html"/>
    <LoggedInPane>
      <p>You are logged in.</p>
    </LoggedInPane>
    <LoggedOutPane>
      <p>You are logged out.</p>
    </LoggedOutPane>
  </div>;

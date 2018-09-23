import React from 'react';
import { user } from '@solid/query-ldflex';
import { AuthButton, LoggedInPane, LoggedOutPane, DataField } from '../src/';

export default () =>
  <div>
    <h1>Solid App</h1>
    <AuthButton popup="popup.html"/>
    <LoggedInPane>
      <p>Welcome back, <DataField data={user.name}/>.</p>
    </LoggedInPane>
    <LoggedOutPane>
      <p>You are logged out.</p>
    </LoggedOutPane>
  </div>;

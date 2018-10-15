import React from 'react';
import { AuthButton, LoggedInPane, LoggedOutPane, DataField, Image } from '../src/';

export default () =>
  <div>
    <h1>Solid App</h1>
    <AuthButton popup="popup.html"/>
    <LoggedInPane>
      <Image src="user.image" defaultSrc="profile.svg" className="profile"/>
      <p>Welcome back, <DataField data="user.name"/>.</p>
    </LoggedInPane>
    <LoggedOutPane>
      <p>You are logged out.</p>
    </LoggedOutPane>
  </div>;

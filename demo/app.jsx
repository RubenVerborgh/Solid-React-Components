import React from 'react';
import { AuthButton, LoggedInPane, LoggedOutPane, Value, Image, List } from '../src/';

export default () =>
  <div>
    <h1>Solid App</h1>
    <AuthButton popup="popup.html"/>
    <LoggedInPane>
      <Image src="user.image" defaultSrc="profile.svg" className="profile"/>
      <p>Welcome back, <Value src="user.name"/>.</p>
      <h2>Friends</h2>
      <List src="user.friends.firstName"/>
    </LoggedInPane>
    <LoggedOutPane>
      <p>You are logged out.</p>
    </LoggedOutPane>
  </div>;

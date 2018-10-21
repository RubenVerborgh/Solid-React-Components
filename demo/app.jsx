import React from 'react';
import {
  AuthButton, LoggedInPane, LoggedOutPane,
  Value, Image, List, Link, Label,
} from '../src/';

export default () =>
  <div>
    <header>
      <h1>Solid App</h1>
      <AuthButton popup="popup.html"/>
    </header>
    <main>
      <LoggedInPane>
        <Image src="user.image" defaultSrc="profile.svg" className="profile"/>
        <p>Welcome back, <Value src="user.name"/>.</p>
        <h2>Friends</h2>
        <List src="user.friends.firstName"/>
      </LoggedInPane>
      <LoggedOutPane>
        <p>You are logged out.</p>
      </LoggedOutPane>
    </main>
    <footer>
      <p>
        Solid React demo app
        by <Label src="[https://ruben.verborgh.org/profile/#me]"/> {' '}
        (<Link href="[https://ruben.verborgh.org/profile/#me].homepage"/>)
      </p>
    </footer>
  </div>;

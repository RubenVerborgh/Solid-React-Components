import React from 'react';
import {
  AuthButton, LoggedIn, LoggedOut,
  Value, Image, List, Link, Label,
  Like,
} from '../src/';

export default function App() {
  return (
    <div>
      <header>
        <h1>Solid App</h1>
        <p><AuthButton popup="popup.html"/></p>
        <p>
          <Like object="[https://github.com/solid/react-components]">
            the Solid React components</Like>
        </p>
      </header>
      <main>
        <LoggedIn>
          <Image src="user.image" defaultSrc="profile.svg" className="profile"/>
          <p>Welcome back, <Value src="user.name"/>.</p>
          <h2>Friends</h2>
          <List src="user.friends.firstName"/>
        </LoggedIn>
        <LoggedOut>
          <p>You are logged out.</p>
        </LoggedOut>
      </main>
      <footer>
        <p>
          Solid React demo app
          by <Label src="[https://ruben.verborgh.org/profile/#me]"/> {' '}
          (<Link href="[https://ruben.verborgh.org/profile/#me].homepage"/>)
        </p>
      </footer>
    </div>
  );
}

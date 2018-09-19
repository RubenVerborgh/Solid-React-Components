import React from 'react';
import ReactDOM from 'react-dom';
import { LoginButton } from '../src/';

const container = document.createElement('main');
document.body.appendChild(container);
ReactDOM.render(
  <div>
    <h1>Solid App</h1>
    <LoginButton/>
  </div>,
  container);

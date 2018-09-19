import React from 'react';
import { AuthPane } from '..';

/** Pane that only shows its contents when the user is logged in. */
export default ({ children }) => <AuthPane loggedIn={children}/>;

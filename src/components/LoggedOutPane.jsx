import React from 'react';
import { AuthPane } from '..';

/** Pane that only shows its contents when the user is logged out. */
export default ({ children }) => <AuthPane loggedOut={children}/>;

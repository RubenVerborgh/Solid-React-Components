import withWebId from './withWebId';

/** Pane showing different content depending on whether the user is logged in. */
export default withWebId(({ webId, loggedIn = null, loggedOut = null }) =>
  webId ? loggedIn : loggedOut);

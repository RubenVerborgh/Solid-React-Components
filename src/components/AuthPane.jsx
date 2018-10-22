import withWebId from './withWebId';

/** Pane showing different content depending on whether the user is logged in. */
export default withWebId(function AuthPane({
  webId, loggedIn = null, loggedOut = null,
}) {
  return webId ? loggedIn : loggedOut;
});

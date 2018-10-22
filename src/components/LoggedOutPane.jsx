import withWebId from './withWebId';

/** Pane that only shows its contents when the user is logged out. */
export default withWebId(function LoggedOutPane({ webId, children }) {
  return !webId && children || null;
});

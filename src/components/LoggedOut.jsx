import useWebId from '../hooks/useWebId';

/** Pane that only shows its contents when the user is logged out. */
export default function LoggedOut({ children }) {
  const webId = useWebId();
  return !webId && children || null;
}

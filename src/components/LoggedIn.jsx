import useWebId from '../hooks/useWebId';

/** Pane that only shows its contents when the user is logged in. */
export default function LoggedIn({ children }) {
  const webId = useWebId();
  return webId && children || null;
}

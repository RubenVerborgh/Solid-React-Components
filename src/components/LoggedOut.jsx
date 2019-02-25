import useLoggedOut from '../hooks/useLoggedOut';

/** Pane that only shows its contents when the user is logged out. */
export default function LoggedOut({ children = null }) {
  const loggedOut = useLoggedOut();
  return loggedOut ? children : null;
}

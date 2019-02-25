import useLoggedIn from '../hooks/useLoggedIn';

/** Pane that only shows its contents when the user is logged in. */
export default function LoggedIn({ children = null }) {
  const loggedIn = useLoggedIn();
  return loggedIn ? children : null;
}

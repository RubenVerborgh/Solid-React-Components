import useWebId from './useWebId';

/**
 * Returns whether the user is logged in,
 * or `undefined` if the user state is pending.
 */
export default function useLoggedIn() {
  const webId = useWebId();
  return webId === undefined ? undefined : webId !== null;
}

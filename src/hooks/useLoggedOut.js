import useWebId from './useWebId';

/**
 * Returns whether the user is logged out,
 * or `undefined` if the user state is pending.
 */
export default function useLoggedOut() {
  const webId = useWebId();
  return webId === undefined ? undefined : webId === null;
}

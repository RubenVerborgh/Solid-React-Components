import { useDebugValue } from 'react';
import useWebId from './useWebId';

const isNull = (_, id) => id === undefined ? undefined : id === null;

/**
 * Returns whether the user is logged out,
 * or `undefined` if the user state is pending.
 */
export default function useLoggedOut() {
  const loggedOut = useWebId(isNull);
  useDebugValue(loggedOut);
  return loggedOut;
}

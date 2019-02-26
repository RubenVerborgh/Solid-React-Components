import { useReducer, useEffect, useDebugValue } from 'react';
import auth from 'solid-auth-client';

// Keep track of the WebID and the state setters tracking it
let webId = undefined;
const subscribers = new Set();
const getWebId = (_, id) => id;

/**
 * Returns the WebID (string) of the active user,
 * `null` if there is no user,
 * or `undefined` if the user state is pending.
 */
export default function useWebId(reducer = getWebId) {
  const [result, updateWebId] = useReducer(reducer, webId, reducer);
  useDebugValue(webId);

  useEffect(() => {
    updateWebId(webId);
    subscribers.add(updateWebId);
    return () => subscribers.delete(updateWebId);
  }, []);

  return result;
}

// Inform subscribers when the WebID changes
auth.trackSession(session => {
  webId = session ? session.webId : null;
  for (const subscriber of subscribers)
    subscriber(webId);
});

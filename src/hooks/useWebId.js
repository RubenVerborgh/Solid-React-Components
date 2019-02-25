import { useState, useEffect } from 'react';
import auth from 'solid-auth-client';

// Keep track of the WebID and the state setters following it
let webId;
const setters = new Set();

/**
 * Returns the WebID (string) of the active user,
 * `null` if there is no user,
 * or `undefined` if the user state is pending.
 */
export default function useWebId() {
  const [, setWebId] = useState(webId);

  useEffect(() => {
    setters.add(setWebId);
    return () => setters.delete(setWebId);
  }, []);

  return webId;
}

// Inform all setters when the WebID changes
auth.trackSession(session => {
  webId = session && session.webId;
  for (const setter of setters)
    setter(webId);
});

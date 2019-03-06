import { useContext, useDebugValue } from 'react';
import UpdateContext from '../UpdateContext';

/**
 * Hook that rerenders components inside of a <LiveUpdate> container
 * whenever an update happens to one of the subscribed resources.
 *
 * This is a shortcut for using UpdateContext as a context,
 * and returns the latest update as `{ timestamp, url }`.
 */
export default function useLiveUpdate() {
  const latestUpdate = useContext(UpdateContext);
  useDebugValue(latestUpdate.timestamp || null);
  return latestUpdate;
}

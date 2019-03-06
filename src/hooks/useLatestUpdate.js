import { useState, useEffect, useDebugValue } from 'react';
import UpdateTracker from '../UpdateTracker';

/**
 * Hook that subscribes to updates on the given resources,
 * returning the latest update as `{ timestamp, url }`.
 */
export default function useLatestUpdate(...urls) {
  const [latestUpdate, setLatestUpdate] = useState({});
  useDebugValue(latestUpdate.timestamp || null);
  useEffect(() => {
    const tracker = new UpdateTracker(setLatestUpdate);
    tracker.subscribe(...urls);
    return () => tracker.unsubscribe(...urls);
  }, urls);
  return latestUpdate;
}

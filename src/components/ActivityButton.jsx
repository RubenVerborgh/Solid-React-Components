import React, { useState } from 'react';
import data from '@solid/query-ldflex';
import { srcToLDflex } from '../util';
import useLDflexValue from '../hooks/useLDflexValue';

const { as } = data.context;

/**
 * Button that displays whether the user has performed an activity;
 * when clicked, performs the activity.
 */
export default function ActivityButton({
  activityType = `${as}Like`,
  object = `[${window.location.href}]`,
  shortName = /\w*$/.exec(activityType)[0],
  className = `solid activity ${shortName.toLowerCase()}`,
  suggestActivity = shortName,
  displayActivity = suggestActivity,
}) {
  // Look up a possibly existing activity
  object = srcToLDflex(object);
  const [exists, setExists] = useState();
  const activity = useLDflexValue(`${object}.findActivity("${activityType}")`);
  if (exists === undefined && activity)
    setExists(true);

  // Creates a new activity (if none already exists)
  async function toggleActivity() {
    // Optimistically display the result
    setExists(!exists);
    try {
      // Try performing the action
      const action = !exists ? 'create' : 'delete';
      await data.resolve(`${object}.${action}Activity("${activityType}")`);
      // Confirm the result (in case a concurrent action was pending)
      setExists(!exists);
    }
    catch (error) {
      // Revert to the previous state
      setExists(exists);
      console.warn('@solid/react-components', error);
    }
  }

  // Return the activity button
  className = `${className} ${exists ? 'performed' : ''}`;
  return (
    <button className={className} onClick={toggleActivity}>
      { exists ? displayActivity : suggestActivity }
    </button>
  );
}

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
  const [exists, setExists] = useState(false);
  const activity = useLDflexValue(`${object}.findActivity("${activityType}")`);
  if (activity && !exists)
    setExists(true);

  // Creates a new activity (if none already exists)
  async function createActivity() {
    if (!exists) {
      setExists(true);
      try {
        await data.resolve(`${object}.createActivity("${activityType}")`);
      }
      catch (error) {
        setExists(false);
        console.warn('@solid/react-components', error);
      }
    }
  }

  // Return the activity button
  className = `${className} ${exists ? 'performed' : ''}`;
  return (
    <button className={className} onClick={createActivity}>
      { exists ? displayActivity : suggestActivity }
    </button>
  );
}

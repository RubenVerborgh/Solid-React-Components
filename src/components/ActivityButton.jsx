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
  children,
  shortName = /\w*$/.exec(activityType)[0],
  className = `solid activity ${shortName.toLowerCase()}`,
  activateText = shortName,
  deactivateText = activateText,
  activateLabel = children ? [activateText, ' ', children] : activateText,
  deactivateLabel = children ? [deactivateText, ' ', children] : deactivateText,
  ...props
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
    <button className={className} onClick={toggleActivity} {...props}>
      { exists ? deactivateLabel : activateLabel }
    </button>
  );
}

// Internal helper for creating custom activity buttons
export function customActivityButton(type, activate, deactivate, deactivateNoChildren) {
  const activityType = `${as}${type}`;
  return ({
    object,
    children = object ? null : 'this page',
    activateText = activate,
    deactivateText = children ? deactivate : deactivateNoChildren,
    ...props
  }) =>
    <ActivityButton {...props}
      {...{ activityType, object, children, activateText, deactivateText }} />;
}

import React from 'react';
import resolveExpressions from './resolveExpressions';

/** Displays the value of a Solid LDflex expression. */
export default resolveExpressions(['data'], ({ pending, error, value }) => {
  // Render pending state
  if (pending)
    return <span className="solid data pending"/>;
  // Render error state
  if (error)
    return <span className="solid data error" error={error}/>;
  // Render empty value
  if (value === undefined || value === null)
    return <span className="solid data empty"/>;
  // Render stringified value
  return `${value}`;
});

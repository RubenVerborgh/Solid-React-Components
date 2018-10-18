import React from 'react';
import evaluateExpressions from './evaluateExpressions';

/** Displays the value of a Solid LDflex expression. */
export default evaluateExpressions(['data'], ({ pending, error, data }) => {
  // Render pending state
  if (pending)
    return <span className="solid data pending"/>;
  // Render error state
  if (error)
    return <span className="solid data error" error={error.message}/>;
  // Render empty value
  if (data === undefined || data === null)
    return <span className="solid data empty"/>;
  // Render stringified value
  return `${data}`;
});

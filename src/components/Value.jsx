import React from 'react';
import evaluateExpressions from './evaluateExpressions';

/** Displays the value of a Solid LDflex expression. */
export default evaluateExpressions(['src'], ({ pending, error, src }) => {
  // Render pending state
  if (pending)
    return <span className="solid value pending"/>;
  // Render error state
  if (error)
    return <span className="solid value error" data-error={error.message}/>;
  // Render empty value
  if (src === undefined || src === null)
    return <span className="solid value empty"/>;
  // Render stringified value
  return `${src}`;
});

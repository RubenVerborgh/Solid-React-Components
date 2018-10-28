import React from 'react';
import PropTypes from './prop-types';
import evaluateExpressions from './evaluateExpressions';

/** Displays the value of a Solid LDflex expression. */
const Value = evaluateExpressions(['src'], function Value({
  pending, error, src, children,
}) {
  // Render pending state
  if (pending)
    return children || <span className="solid value pending"/>;
  // Render error state
  if (error)
    return children || <span className="solid value error" data-error={error.message}/>;
  // Render empty value
  if (src === undefined || src === null)
    return children || <span className="solid value empty"/>;
  // Render stringified value
  return `${src}`;
});
export default Value;

Value.propTypes = {
  src: PropTypes.LDflex.isRequired,
  children: PropTypes.children,
};

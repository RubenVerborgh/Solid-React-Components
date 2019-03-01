import React from 'react';
import useLDflex from '../hooks/useLDflex';

/** Displays the value of a Solid LDflex expression. */
export default function Value({ src, children }) {
  const [value, pending, error] = useLDflex(src);
  // Render pending state
  if (pending)
    return children || <span className="solid value pending"/>;
  // Render error state
  if (error)
    return children || <span className="solid value error" data-error={error.message}/>;
  // Render empty value
  if (value === undefined || value === null)
    return children || <span className="solid value empty"/>;
  // Render stringified value
  return `${value}`;
}

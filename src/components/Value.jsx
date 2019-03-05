import React from 'react';
import useLDflex from '../hooks/useLDflex';

/** Displays the value of a Solid LDflex expression. */
export default function Value({ src, children }) {
  const [value, pending, error] = useLDflex(src);
  // Render stringified value
  if (value !== undefined && value !== null)
    return `${value}`;
  // Render pending state
  else if (pending)
    return children || <span className="solid value pending"/>;
  // Render error state
  else if (error)
    return children || <span className="solid value error" data-error={error.message}/>;
  // Render empty value
  else
    return children || <span className="solid value empty"/>;
}

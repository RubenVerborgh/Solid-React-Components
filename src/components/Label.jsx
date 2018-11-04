import React from 'react';
import Value from './Value';

/** Displays the label of a Solid LDflex subject. */
export default function Label({ src, children = null }) {
  return <Value src={src && `${src}.label`}>{children}</Value>;
}

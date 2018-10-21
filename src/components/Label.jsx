import React from 'react';
import Value from './Value';

/** Displays the label of a Solid LDflex subject. */
export default ({ src, children = null }) =>
  <Value src={src && `${src}.label`}>{children}</Value>;

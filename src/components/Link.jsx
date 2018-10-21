import React from 'react';
import evaluateExpressions from './evaluateExpressions';
import { domProps } from '../util';

/** Creates a link to the value of the Solid LDflex expression. */
export default evaluateExpressions(['href'], ({
  href = null, children = href, ...props
}) =>
  href ? <a href={href} {...domProps(props)}>{children}</a> : children
);

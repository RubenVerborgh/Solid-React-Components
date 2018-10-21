import React from 'react';
import Label from './Label';
import evaluateExpressions from './evaluateExpressions';
import { domProps } from '../util';

/** Creates a link to the value of the Solid LDflex expression. */
export default evaluateExpressions(['href'], ({
  href = '',
  children = <Label src={href && `[${href}]`}>{`${href}`}</Label>,
  ...props
}) =>
  href ? <a href={href} {...domProps(props)}>{children}</a> : children
);

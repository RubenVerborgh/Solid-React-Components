import React from 'react';
import Label from './Label';
import useLDflexValue from '../hooks/useLDflexValue';

/** Creates a link to the value of the Solid LDflex expression. */
export default function Link({ href, children, ...props }) {
  href = useLDflexValue(href) || '';
  children = children || <Label src={href && `[${href}]`}>{`${href}`}</Label>;
  return href ? <a href={href} {...props}>{children}</a> : children;
}

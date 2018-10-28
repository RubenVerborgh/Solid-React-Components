import React from 'react';
import PropTypes from './prop-types';
import Label from './Label';
import evaluateExpressions from './evaluateExpressions';
import { domProps } from '../util';

/** Creates a link to the value of the Solid LDflex expression. */
const Link = evaluateExpressions(['href'], function Link({
  href = '',
  children = <Label src={href && `[${href}]`}>{`${href}`}</Label>,
  ...props
}) {
  return href ? <a href={href} {...domProps(props)}>{children}</a> : children;
});
export default Link;

Link.propTypes = {
  href: PropTypes.LDflex.isRequired,
  children: PropTypes.children,
};

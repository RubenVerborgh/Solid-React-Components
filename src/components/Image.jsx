import React from 'react';
import evaluateExpressions from './evaluateExpressions';
import { domProps } from '../util';

/** Displays an image whose source is a Solid LDflex expression. */
export default evaluateExpressions(['src'], function Image({
  defaultSrc, src = defaultSrc, children = null, ...props
}) {
  return src ? <img src={src} alt="" {...domProps(props)}/> : children;
});

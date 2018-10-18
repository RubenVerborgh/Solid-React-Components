import React from 'react';
import evaluateExpressions from './evaluateExpressions';
import { domProps } from '../util';

/** Displays an image whose source is a Solid LDflex expression. */
export default evaluateExpressions(['src'], ({ defaultSrc, src = defaultSrc, ...props }) =>
  src ? <img src={src} alt="" {...domProps(props)}/> : null);

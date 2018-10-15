import React from 'react';
import resolveExpressions from './resolveExpressions';
import { domProps } from '../util';

/** Displays an image whose source is a Solid LDflex expression. */
export default resolveExpressions(['src'], ({ defaultSrc, src = defaultSrc, ...props }) =>
  src ? <img src={src} alt="" {...domProps(props)}/> : null);

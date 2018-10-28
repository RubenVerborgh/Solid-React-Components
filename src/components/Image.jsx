import React from 'react';
import PropTypes from './prop-types';
import evaluateExpressions from './evaluateExpressions';
import { domProps } from '../util';

/** Displays an image whose source is a Solid LDflex expression. */
const Image = evaluateExpressions(['src'], function Image({
  defaultSrc, src = defaultSrc, children = null, ...props
}) {
  return src ? <img src={src} alt="" {...domProps(props)}/> : children;
});
export default Image;

Image.propTypes = {
  src: PropTypes.LDflex.isRequired,
  defaultSrc: PropTypes.string,
  children: PropTypes.children,
};

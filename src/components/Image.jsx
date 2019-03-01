import React from 'react';
import useLDflexValue from '../hooks/useLDflexValue';

/** Displays an image whose source is a Solid LDflex expression. */
export default function Image({ src, defaultSrc, children = null, ...props }) {
  src = useLDflexValue(src) || defaultSrc;
  return src ? <img src={src} alt="" {...props}/> : children;
}

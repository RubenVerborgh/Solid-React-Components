import React from 'react';
import Value from './Value';
import { srcToLDflex } from '../util';

/** Displays the name of a Solid LDflex subject. */
export default function Name({ src, children = null }) {
  return <Value src={src && `${srcToLDflex(src)}.name`}>{children}</Value>;
}

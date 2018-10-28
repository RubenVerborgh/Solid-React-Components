import React from 'react';
import PropTypes from './prop-types';
import Value from './Value';

/** Displays the name of a Solid LDflex subject. */
export default function Name({ src, children = null }) {
  return <Value src={src && `${src}.name`}>{children}</Value>;
}

Name.propTypes = {
  src: PropTypes.LDflex.isRequired,
  children: PropTypes.children,
};

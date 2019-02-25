import React from 'react';
import useWebId from '../hooks/useWebId';
import { higherOrderComponent } from '../util';

/**
 * Higher-order component that passes the WebID of the logged-in user
 * to the webId property of the wrapped component.
 */
export default higherOrderComponent('WithWebId', Component =>
  props => <Component {...props} webId={useWebId()} />);

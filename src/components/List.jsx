import React from 'react';
import evaluateList from './evaluateList';

/** Displays a list of items matching a Solid LDflex expression. */
export default evaluateList('items', ({ items }) =>
  <ul>{items.map((item, index) =>
    <li key={index}>{`${item}`}</li>)}
  </ul>
);

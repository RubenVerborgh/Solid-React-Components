import React from 'react';
import evaluateList from './evaluateList';

/** Displays a list of items matching a Solid LDflex expression. */
export default evaluateList('src', function List({ src }) {
  return (
    <ul>{src.map((item, index) =>
      <li key={index}>{`${item}`}</li>)}
    </ul>
  );
});

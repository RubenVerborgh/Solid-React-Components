import React from 'react';
import evaluateList from './evaluateList';

/** Displays a list of items matching a Solid LDflex expression. */
export default evaluateList('src', function List({
  src,
  container = items => <ul>{items}</ul>,
  children = (item, index) => <li key={index}>{`${item}`}</li>,
}) {
  const items = src.map(children);
  return container ? container(items) : items;
});

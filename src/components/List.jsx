import React from 'react';
import PropTypes from './prop-types';
import evaluateList from './evaluateList';

/** Displays a list of items matching a Solid LDflex expression. */
const List = evaluateList('src', function List({
  src, offset = 0, limit = Infinity, filter = () => true,
  container = items => <ul>{items}</ul>,
  children = (item, index) => <li key={index}>{`${item}`}</li>,
}) {
  const items = src
    .filter(filter)
    .slice(offset, +offset + +limit)
    .map(children);
  return container ? container(items) : items;
});
export default List;

List.propTypes = {
  src: PropTypes.LDflex.isRequired,
  container: PropTypes.func,
  children: PropTypes.func,
  limit: PropTypes.numberString,
  offset: PropTypes.numberString,
  filter: PropTypes.func,
};

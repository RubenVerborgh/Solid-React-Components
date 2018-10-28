import PropTypes from 'prop-types';

const CustomPropTypes = Object.create(PropTypes);
export default CustomPropTypes;

CustomPropTypes.numberString = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.string,
]);

CustomPropTypes.children = PropTypes.oneOfType([
  PropTypes.array,
  PropTypes.string,
  PropTypes.element,
]);

CustomPropTypes.LDflex = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.object,
]);

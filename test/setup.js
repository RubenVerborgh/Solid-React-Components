/* eslint no-console: off */
import 'jest-dom/extend-expect';

const warn = console.warn;
console.warn = (...args) => {
  // Ignore warnings we generate ourselves
  if (args[0] === '@solid/react-components')
    return;
  warn(...args);
};

const error = console.error;
console.error = (...args) => {
  // Ignore invalid prop-types that we test on purpose
  if (/Failed prop type/.test(args[0]))
    return;
  error(...args);
};

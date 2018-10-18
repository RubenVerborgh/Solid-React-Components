import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

// Suppress our own warnings in test output
const warn = console.warn;
console.warn = (...args) => {
  if (args[0] !== '@solid/react-components')
    warn(...args);
};

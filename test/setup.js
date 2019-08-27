/* eslint no-console: off */
import '@testing-library/jest-dom/extend-expect';

// Hide warnings and errors we trigger on purpose
const { warn, error } = console;
let muted = false;
Object.assign(console, {
  warn(...args) {
    // Ignore warnings we generate ourselves
    if (muted || args[0] === '@solid/react-components')
      return;
    warn(...args);
  },

  error(...args) {
    // Ignore invalid prop-types that we test on purpose
    if (muted || /Failed prop type/.test(args[0]))
      return;
    error(...args);
  },

  mute() {
    muted = true;
  },

  unmute() {
    muted = false;
  },
});

// Mock the window.location property
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost/',
  },
});

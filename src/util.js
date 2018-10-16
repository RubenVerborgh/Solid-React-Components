import * as data from '@solid/query-ldflex';

/**
 * Resolves the given string expression against Solid LDflex.
 */
export function resolveLDflex(expression) {
  const body = `"use strict";return solid.data.${expression}`;
  let evaluator;
  try {
    /* eslint no-new-func: off */
    evaluator = Function('solid', body);
  }
  catch ({ message }) {
    throw new Error(`Expression "${expression}" is invalid: ${message}`);
  }
  return evaluator({ data });
}

/**
 * Filters component properties that are safe to use in the DOM.
 */
export function domProps(props = {}) {
  const safe = {};
  for (const name in props) {
    // Skip properties with uppercase letters (except for className)
    if (!/^([a-z-]+|className)$/.test(name))
      continue;
    // Skip non-string values
    const value = props[name];
    if (typeof value !== 'string')
      continue;
    // Keep all others
    safe[name] = value;
  }
  return safe;
}

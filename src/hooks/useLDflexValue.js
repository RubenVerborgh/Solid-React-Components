import useLDflex from './useLDflex';

/**
 * Evaluates the Solid LDflex expression into a single value.
 */
export default function useLDflexValue(expression) {
  return useLDflex(expression, false)[0];
}

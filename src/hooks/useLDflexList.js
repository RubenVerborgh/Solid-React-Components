import useLDflex from './useLDflex';

/**
 * Evaluates the Solid LDflex expression into a list.
 */
export default function useLDflexList(expression) {
  return useLDflex(expression, true)[0];
}

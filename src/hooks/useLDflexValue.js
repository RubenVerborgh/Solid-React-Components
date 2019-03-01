import { useDebugValue } from 'react';
import useLDflex, { toString } from './useLDflex';

/**
 * Evaluates the Solid LDflex expression into a single value.
 */
export default function useLDflexValue(expression) {
  const [value] = useLDflex(expression, false);
  useDebugValue(value, toString);
  return value;
}

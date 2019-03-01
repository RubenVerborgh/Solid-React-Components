import { useDebugValue } from 'react';
import useLDflex, { toString } from './useLDflex';

/**
 * Evaluates the Solid LDflex expression into a list.
 */
export default function useLDflexList(expression) {
  const [items] = useLDflex(expression, true);
  useDebugValue(items, toString);
  return items;
}

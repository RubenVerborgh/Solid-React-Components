import { useState, useEffect, useDebugValue } from 'react';
import useWebId from './useWebId';
import useLiveUpdate from './useLiveUpdate';
import ExpressionEvaluator from '../ExpressionEvaluator';

const value = { result: undefined, pending: true, error: undefined };
const list = { result: [], pending: true, error: undefined };
const none = {};

/**
 * Evaluates the Solid LDflex expression.
 * Returns an array of [result, pending, error].
 */
export default function useLDflex(expression, listMode = false) {
  // The user's WebID and recent updates might influence the evaluation
  const webId = useWebId();
  const latestUpdate = useLiveUpdate();

  // Obtain the latest expression result from the state
  const [{ result, pending, error }, update] = useState(listMode ? list : value);
  useDebugValue(error || result, toString);

  // Set up the expression evaluator
  useEffect(() => {
    const evaluator = new ExpressionEvaluator();
    const query = { result: expression };
    evaluator.evaluate(!listMode ? query : none, listMode ? query : none,
      changed => update(current => ({ ...current, ...changed })));
    return () => evaluator.destroy();
  }, [expression, latestUpdate, webId && typeof expression === 'string']);

  // Return the state components
  return [result, pending, error];
}

export function toString(object) {
  return Array.isArray(object) ? object.map(toString) : `${object}`;
}

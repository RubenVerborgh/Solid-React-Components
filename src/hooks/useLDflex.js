import { useState, useEffect } from 'react';
import useWebId from './useWebId';
import ExpressionEvaluator from '../ExpressionEvaluator';

const value = { result: undefined, pending: true, error: undefined };
const list = { result: [], pending: true, error: undefined };
const none = {};

/**
 * Evaluates the Solid LDflex expression.
 * Returns an array of [result, pending, error].
 */
export default function useLDflex(expression, listMode = false) {
  // Expression values might differ based on the user's WebID
  const webId = useWebId();
  let [{ result, pending, error }, update] = useState(listMode ? list : value);

  // Set up the expression evaluator
  useEffect(() => {
    const evaluator = new ExpressionEvaluator();
    const query = { result: expression };
    evaluator.evaluate(!listMode ? query : none, listMode ? query : none,
      changed => update(current => ({ ...current, ...changed })));
    return () => evaluator.destroy();
  }, [expression, webId && typeof expression === 'string']);

  // Return the state components
  return [result, pending, error];
}

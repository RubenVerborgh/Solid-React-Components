import React from 'react';
import UpdateContext from '../UpdateContext';
import useLatestUpdate from '../hooks/useLatestUpdate';

const { Provider } = UpdateContext;

/**
 * Component that creates an UpdateContext by subscribing
 * to updates of a whitespace-separated list of resources.
 *
 * Children or descendants that use UpdateContext as a context
 * will be rerendered if any of those resources are updated.
 */
export default function LiveUpdate({ subscribe = '', children = null }) {
  const urls = subscribe.trim() ? subscribe.split(/\s+/) : [];
  const latestUpdate = useLatestUpdate(...urls);
  return <Provider value={latestUpdate}>{children}</Provider>;
}

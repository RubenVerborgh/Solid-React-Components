import auth from 'solid-auth-client';
import ldflex from '@solid/query-ldflex';

// Wildcard for tracking all resources
const ALL = '*';
// Subscribers per resource URL
const subscribers = {};
// WebSockets per host
const webSockets = {};
// All fetched URLs
const fetchedUrls = new Set();

/**
 * Notifies a subscriber of updates to resources on a Solid server,
 * by listening to its WebSockets.
 */
export default class UpdateTracker {
  /** Create a tracker that sends updates to the given subscriber function. */
  constructor(subscriber) {
    this.subscriber = subscriber;
  }

  /** Subscribes to changes in the given resources */
  subscribe(...urls) {
    for (let url of urls) {
      // Create a new subscription to the resource if none existed
      url = url.replace(/#.*/, '');
      if (!(url in subscribers)) {
        subscribers[url] = new Set();
        if (url !== ALL)
          trackResource(url);
        else
          fetchedUrls.forEach(trackResource);
      }
      // Add the new subscriber
      subscribers[url].add(this.subscriber);
    }
  }

  /** Unsubscribes to changes in the given resources */
  unsubscribe(...urls) {
    for (let url of urls) {
      url = url.replace(/#.*/, '');
      if (url in subscribers)
        subscribers[url].delete(this.subscriber);
    }
  }
}

/** Tracks updates to the given resource */
function trackResource(url, retryAttempt, delay) {
  // Try to find an existing socket for the host
  const { protocol, host } = new URL(url);
  let webSocket = webSockets[host];

  // If none exists, create a new one
  if (!webSocket || webSocket.reopen) {
    const socketUrl = `${protocol.replace('http', 'ws')}//${host}/`;
    webSockets[host] = webSocket = new WebSocket(socketUrl);
    const backOffDelay = delay || 1000;
    Object.assign(webSocket, { enqueue, onmessage,
      ready: new Promise(resolve => (webSocket.onopen = resolve)),
      onclose: oncloseFor(host),
      resources: [],
    });
    setUpBackOff(webSocket, retryAttempt || 0, backOffDelay);
  }

  webSocket.resources.push(url); // Storing URL of resouce that will be subscribed to

  // Subscribe to updates on the resource
  webSocket.enqueue(`sub ${url}`);
}

/** Enqueues data on the WebSocket */
async function enqueue(data) {
  await this.ready;
  this.send(data);
  setUpBackOff(this, 0, 1000);
}

/** Processes an update message from the WebSocket */
function onmessage({ data }) {
  // Verify the message is an update notification
  const match = /^pub +(.+)/.exec(data);
  if (!match)
    return;

  // Invalidate the cache for the resource
  const url = match[1];
  ldflex.clearCache(url);

  // Notify the subscribers
  const update = { timestamp: new Date(), url };
  for (const subscriber of subscribers[url] || [])
    subscriber(update);
  for (const subscriber of subscribers[ALL] || [])
    subscriber(update);
}

function oncloseFor(host) {
  return function () {
    let ws = webSockets[host];
    webSockets[host].reopen = true;
    reconnectAfterBackoff(ws);
  };
}

/** Reconnect WebSocket after a backoff delay */
async function reconnectAfterBackoff(ws) {
  if (ws.retry++ < 6) {
    await ws.backoff;
    const nextDelay = ws.delay * 2;
    ws.resources.forEach(url => trackResource(url, ws.retry, nextDelay));
  }
}

function setUpBackOff(webSocket, retryAttempt, backOffDelay) {
  Object.assign(webSocket, {
    delay: backOffDelay,
    backoff: new Promise(resolve => (setTimeout(resolve, backOffDelay))),
    retry: retryAttempt,
  });
}

// Keep track of all fetched resources
auth.on('request', url => {
  if (!fetchedUrls.has(url)) {
    if (ALL in subscribers)
      trackResource(url);
    fetchedUrls.add(url);
  }
});

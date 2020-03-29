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
          fetchedUrls.forEach(fetchedUrl => trackResource(fetchedUrl));
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
function trackResource(url, webSocketOptions = {}) {
  // Try to find an existing socket for the host
  const { protocol, host } = new URL(url);
  let webSocket = webSockets[host];

  // If no socket exists, create a new one
  if (!webSocket) {
    const socketUrl = `${protocol.replace('http', 'ws')}//${host}/`;
    webSockets[host] = webSocket = new WebSocket(socketUrl);
    Object.assign(webSocket, {
      host,
      resources: new Set(),
      reconnectionAttempts: 0,
      reconnectionDelay: 1000,
      enqueue,
      onmessage: processMessage,
      onclose: reconnect,
      ready: new Promise(resolve => {
        webSocket.onopen = () => {
          webSocket.reconnectionAttempts = 0;
          webSocket.reconnectionDelay = 1000;
          resolve();
        };
      }),
    }, webSocketOptions);
  }

  // Each WebSocket keeps track of subscribed resources
  // so we can resubscribe later if needed
  webSocket.resources.add(url);

  // Subscribe to updates on the resource
  webSocket.enqueue(`sub ${url}`);
}

/** Enqueues data on the WebSocket */
async function enqueue(data) {
  await this.ready;
  this.send(data);
}

/** Processes an update message from the WebSocket */
function processMessage({ data }) {
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

/** Reconnects a socket after a backoff delay */
async function reconnect() {
  // Ensure this socket is no longer marked as active
  delete webSockets[this.host];

  // Try setting up a new socket
  if (this.reconnectionAttempts < 6) {
    // Wait a given backoff period before reconnecting
    await new Promise(done => (setTimeout(done, this.reconnectionDelay)));
    // Try reconnecting, and back off exponentially
    this.resources.forEach(url => trackResource(url, {
      reconnectionAttempts: this.reconnectionAttempts + 1,
      reconnectionDelay: this.reconnectionDelay * 2,
    }));
  }
}

/** Closes all sockets */
export function resetWebSockets() {
  for (const url in subscribers)
    delete subscribers[url];
  for (const host in webSockets) {
    const socket = webSockets[host];
    delete webSockets[host];
    delete socket.onclose;
    socket.close();
  }
  fetchedUrls.clear();
}

// Keep track of all fetched resources
auth.on('request', url => {
  if (!fetchedUrls.has(url)) {
    if (ALL in subscribers)
      trackResource(url);
    fetchedUrls.add(url);
  }
});

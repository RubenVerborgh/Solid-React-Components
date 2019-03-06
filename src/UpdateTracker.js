import ldflex from '@solid/query-ldflex';

const webSockets = {};
const subscribers = {};

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
    for (const url of urls) {
      // Create a new subscription if none exists for the resource
      if (!(url in subscribers)) {
        const webSocket = this.getWebSocketFor(url);
        webSocket.enqueue(`sub ${url}`);
        subscribers[url] = new Set();
      }
      // Add the new subscriber
      subscribers[url].add(this.subscriber);
    }
  }

  /** Unsubscribes to changes in the given resources */
  unsubscribe(...urls) {
    for (const url of urls) {
      if (url in subscribers)
        subscribers[url].delete(this.subscriber);
    }
  }

  /** Gets or creates the WebSocket corresponding to the given resource */
  getWebSocketFor(url) {
    // Return an existing socket for the host, if it exists
    const { protocol, host } = new URL(url);
    if (host in webSockets)
      return webSockets[host];

    // Create a new socket for the host
    const socketUrl = `${protocol.replace('http', 'ws')}//${host}/`;
    const webSocket = webSockets[host] = new WebSocket(socketUrl);
    Object.assign(webSocket, { enqueue, onmessage,
      ready: new Promise(resolve => (webSocket.onopen = resolve)),
    });
    return webSocket;
  }
}

/** Enqueues data on the WebSocket */
async function enqueue(data) {
  await this.ready;
  this.send(data);
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
  const urlSubscribers = subscribers[url];
  if (urlSubscribers) {
    const change = { timestamp: new Date(), url };
    for (const subscriber of urlSubscribers)
      subscriber(change);
  }
}

import UpdateTracker, { resetWebSockets } from '../src/UpdateTracker';
import auth from 'solid-auth-client';
import ldflex from '@solid/query-ldflex';

const WebSocket = global.WebSocket = jest.fn(() => ({
  send: jest.fn(),
  close: jest.fn(),
}));

describe('An UpdateTracker', () => {
  const callback = jest.fn();
  let updateTracker, webSockets;

  jest.useFakeTimers();

  beforeAll(() => {
    updateTracker = new UpdateTracker(callback);
  });

  function retrieveCreatedWebSockets() {
    webSockets = WebSocket.mock.results.map(s => s.value);
    return webSockets;
  }

  describe('subscribing to 3 resources', () => {
    const resources = [
      'http://a.com/docs/1',
      'http://a.com/docs/2',
      'http://b.com/docs/3',
      'http://b.com/docs/3#thing',
    ];
    beforeAll(async () => {
      WebSocket.mockClear();
      await updateTracker.subscribe(...resources);
      retrieveCreatedWebSockets();
    });

    it('opens WebSockets to the servers of those resources', () => {
      expect(WebSocket).toHaveBeenCalledTimes(2);
      expect(WebSocket).toHaveBeenCalledWith('ws://a.com/');
      expect(WebSocket).toHaveBeenCalledWith('ws://b.com/');
    });

    describe('after the WebSockets have opened', () => {
      beforeAll(() => {
        webSockets.forEach(s => s.onopen());
      });

      it('subscribes to the resources on the different sockets', () => {
        expect(webSockets[0].send).toHaveBeenCalledTimes(2);
        expect(webSockets[0].send).toHaveBeenCalledWith('sub http://a.com/docs/1');
        expect(webSockets[0].send).toHaveBeenCalledWith('sub http://a.com/docs/2');
        expect(webSockets[1].send).toHaveBeenCalledTimes(1);
        expect(webSockets[1].send).toHaveBeenCalledWith('sub http://b.com/docs/3');
      });
    });

    describe('after subscribing to different resources', () => {
      const otherResources = [
        'http://b.com/docs/3',
        'http://b.com/docs/4',
        'http://c.com/docs/5',
      ];
      beforeAll(async () => {
        WebSocket.mockClear();
        webSockets.forEach(s => s.send.mockClear());
        await updateTracker.subscribe(...otherResources);
      });

      it('only opens WebSockets to new servers', () => {
        expect(WebSocket).toHaveBeenCalledTimes(1);
        expect(WebSocket).toHaveBeenCalledWith('ws://c.com/');
      });

      it('only subscribes to new resources', () => {
        expect(webSockets[0].send).toHaveBeenCalledTimes(0);
        expect(webSockets[1].send).toHaveBeenCalledTimes(1);
        expect(webSockets[1].send).toHaveBeenCalledWith('sub http://b.com/docs/4');
      });
    });

    describe('after an untracked resource changes', () => {
      beforeAll(() => {
        callback.mockClear();
        ldflex.clearCache.mockClear();
        webSockets[0].onmessage({ data: 'pub http://a.com/other' });
      });

      it('does not call the subscriber', () => {
        expect(callback).toHaveBeenCalledTimes(0);
      });

      it('clears the LDflex cache', () => {
        expect(ldflex.clearCache).toHaveBeenCalledTimes(1);
        expect(ldflex.clearCache).toHaveBeenCalledWith('http://a.com/other');
      });
    });

    describe('after a tracked resource changes', () => {
      beforeAll(() => {
        callback.mockClear();
        ldflex.clearCache.mockClear();
        webSockets[0].onmessage({ data: 'pub http://a.com/docs/1' });
      });

      it('calls the subscriber with a timestamp and the URL of the resource', () => {
        expect(callback).toHaveBeenCalledTimes(1);
        const args = callback.mock.calls[0];
        expect(args).toHaveLength(1);
        expect(args[0]).toHaveProperty('timestamp');
        expect(args[0].timestamp).toBeInstanceOf(Date);
        expect(args[0]).toHaveProperty('url', 'http://a.com/docs/1');
      });

      it('clears the LDflex cache', () => {
        expect(ldflex.clearCache).toHaveBeenCalledTimes(1);
        expect(ldflex.clearCache).toHaveBeenCalledWith('http://a.com/docs/1');
      });
    });

    describe('after an unknown message arrives for a tracked resource ', () => {
      beforeAll(() => {
        callback.mockClear();
        ldflex.clearCache.mockClear();
        webSockets[0].onmessage({ data: 'ack http://a.com/docs/1' });
      });

      it('does not call the subscriber', () => {
        expect(callback).toHaveBeenCalledTimes(0);
      });

      it('does not clear the LDflex cache', () => {
        expect(ldflex.clearCache).toHaveBeenCalledTimes(0);
      });
    });

    describe('after unsubscribing from a resource', () => {
      beforeAll(async () => {
        callback.mockClear();
        await updateTracker.unsubscribe(
          'http://a.com/docs/1#235',
          'http://a.com/other',
        );
      });

      it('does not call the callback when the resource changes', () => {
        webSockets[0].onmessage({ data: 'pub http://a.com/docs/1' });
        expect(callback).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('subscribing to *', () => {
    describe('before subscribing', () => {
      beforeAll(() => {
        WebSocket.mockClear();
        auth.emit('request', 'http://x.com/1');
        auth.emit('request', 'http://x.com/1');
        auth.emit('request', 'http://x.com/2');
        auth.emit('request', 'https://y.com/3');
      });

      it('does not subscribe to fetched resources', () => {
        expect(WebSocket).toHaveBeenCalledTimes(0);
      });
    });

    describe('after subscribing', () => {
      beforeAll(async () => {
        await updateTracker.subscribe('*');
        retrieveCreatedWebSockets().forEach(s => s.onopen());
      });

      it('subscribes to all previously fetched resources', () => {
        expect(WebSocket).toHaveBeenCalledTimes(2);
        expect(WebSocket).toHaveBeenCalledWith('ws://x.com/');
        expect(WebSocket).toHaveBeenCalledWith('wss://y.com/');

        expect(webSockets[0].send).toHaveBeenCalledTimes(2);
        expect(webSockets[0].send).toHaveBeenCalledWith('sub http://x.com/1');
        expect(webSockets[0].send).toHaveBeenCalledWith('sub http://x.com/2');
        expect(webSockets[1].send).toHaveBeenCalledTimes(1);
        expect(webSockets[1].send).toHaveBeenCalledWith('sub https://y.com/3');
      });

      it('notifies the subscriber when any resource changes', () => {
        callback.mockClear();
        webSockets[0].onmessage({ data: 'pub http://whatever.com/9' });
        expect(callback).toHaveBeenCalledTimes(1);
        webSockets[1].onmessage({ data: 'pub https://other.com/3' });
        expect(callback).toHaveBeenCalledTimes(2);
      });
    });

    describe('when new resources are fetched', () => {
      beforeAll(async () => {
        WebSocket.mockClear();
        auth.emit('request', 'https://z.com/1');
        auth.emit('request', 'https://z.com/2');
        await waitForPromises();
        retrieveCreatedWebSockets().forEach(s => s.onopen());
      });

      it('subscribes to the new resources', () => {
        expect(WebSocket).toHaveBeenCalledTimes(1);
        expect(WebSocket).toHaveBeenCalledWith('wss://z.com/');

        expect(webSockets[0].send).toHaveBeenCalledTimes(2);
        expect(webSockets[0].send).toHaveBeenCalledWith('sub https://z.com/1');
        expect(webSockets[0].send).toHaveBeenCalledWith('sub https://z.com/2');
      });
    });
  });

  describe('when a socket is closed', () => {
    // Ensure clean slate between tests
    beforeEach(resetWebSockets);
    beforeEach(WebSocket.mockClear);

    // Subscribe to resources
    beforeEach(async () => {
      await updateTracker.subscribe('http://retry.com/docs/1', 'http://retry.com/docs/2');
    });

    // Simulate socket closure
    beforeEach(async () => {
      retrieveCreatedWebSockets()[0].onclose();
      WebSocket.mockClear();
    });

    function waitSeconds(seconds) {
      jest.advanceTimersByTime(seconds * 1000);
      return waitForPromises();
    }

    it('resubscribes after 1s backoff time', async () => {
      await waitSeconds(0.5); // backoff time not exceeded yet
      expect(WebSocket).toHaveBeenCalledTimes(0);

      await waitSeconds(0.5); // backoff time exceeded
      expect(WebSocket).toHaveBeenCalledTimes(1);
      expect(WebSocket).toHaveBeenCalledWith('ws://retry.com/');

      retrieveCreatedWebSockets()[0].onopen();
      await webSockets[0].ready;
      expect(webSockets[0].send).toHaveBeenCalledTimes(2);
      expect(webSockets[0].send).toHaveBeenCalledWith('sub http://retry.com/docs/1');
      expect(webSockets[0].send).toHaveBeenCalledWith('sub http://retry.com/docs/2');
    });

    it('makes six attempts to resubscribe with doubling backoff times', async () => {
      await waitSeconds(1);
      expect(WebSocket).toHaveBeenCalledTimes(1);

      retrieveCreatedWebSockets()[0].onclose();
      await waitSeconds(2);
      expect(WebSocket).toHaveBeenCalledTimes(2);

      retrieveCreatedWebSockets()[1].onclose();
      await waitSeconds(4);
      expect(WebSocket).toHaveBeenCalledTimes(3);

      retrieveCreatedWebSockets()[2].onclose();
      await waitSeconds(8);
      expect(WebSocket).toHaveBeenCalledTimes(4);

      retrieveCreatedWebSockets()[3].onclose();
      await waitSeconds(16);
      expect(WebSocket).toHaveBeenCalledTimes(5);

      retrieveCreatedWebSockets()[4].onclose();
      await waitSeconds(32);
      expect(WebSocket).toHaveBeenCalledTimes(6);

      retrieveCreatedWebSockets()[5].onopen();
      await webSockets[5].ready;

      // First five attempts failed to connect so there ere no subscribe calls
      expect(webSockets[0].send).toHaveBeenCalledTimes(0);
      expect(webSockets[1].send).toHaveBeenCalledTimes(0);
      expect(webSockets[2].send).toHaveBeenCalledTimes(0);
      expect(webSockets[3].send).toHaveBeenCalledTimes(0);
      expect(webSockets[4].send).toHaveBeenCalledTimes(0);

      // The sixth attempts succeeded to connect so there was a subscribe call
      expect(webSockets[5].send).toHaveBeenCalledTimes(2);
      expect(webSockets[5].send).toHaveBeenCalledWith('sub http://retry.com/docs/1');
      expect(webSockets[5].send).toHaveBeenCalledWith('sub http://retry.com/docs/2');
    });

    it('does not retry after the sixth attempt', async () => {
      await waitSeconds(1);
      expect(WebSocket).toHaveBeenCalledTimes(1);

      retrieveCreatedWebSockets()[0].onclose();
      await waitSeconds(2);
      expect(WebSocket).toHaveBeenCalledTimes(2);

      retrieveCreatedWebSockets()[1].onclose();
      await waitSeconds(4);
      expect(WebSocket).toHaveBeenCalledTimes(3);

      retrieveCreatedWebSockets()[2].onclose();
      await waitSeconds(8);
      expect(WebSocket).toHaveBeenCalledTimes(4);

      retrieveCreatedWebSockets()[3].onclose();
      await waitSeconds(16);
      expect(WebSocket).toHaveBeenCalledTimes(5);

      retrieveCreatedWebSockets()[4].onclose();
      await waitSeconds(32);
      expect(WebSocket).toHaveBeenCalledTimes(6);

      retrieveCreatedWebSockets()[5].onclose();
      await waitSeconds(64);
      expect(WebSocket).toHaveBeenCalledTimes(6);

      // All five attempts failed to connect so there was no subscribe calls
      expect(webSockets[0].send).toHaveBeenCalledTimes(0);
      expect(webSockets[1].send).toHaveBeenCalledTimes(0);
      expect(webSockets[2].send).toHaveBeenCalledTimes(0);
      expect(webSockets[3].send).toHaveBeenCalledTimes(0);
      expect(webSockets[4].send).toHaveBeenCalledTimes(0);
      expect(webSockets[5].send).toHaveBeenCalledTimes(0);
    });

    it('resets backoff if the connection is dropping and coming back up', async () => {
      await waitSeconds(1);
      expect(WebSocket).toHaveBeenCalledTimes(1);

      retrieveCreatedWebSockets()[0].onclose();
      await waitSeconds(2);
      expect(WebSocket).toHaveBeenCalledTimes(2);

      // Connection succeeded which should reset backoff times
      retrieveCreatedWebSockets()[1].onopen();
      await webSockets[1].ready;
      expect(WebSocket).toHaveBeenCalledTimes(2);

      // Backoff timeouts have been reset back to original times
      retrieveCreatedWebSockets()[1].onclose();
      await waitSeconds(1);
      expect(WebSocket).toHaveBeenCalledTimes(3);

      retrieveCreatedWebSockets()[2].onclose();
      await waitSeconds(2);
      expect(WebSocket).toHaveBeenCalledTimes(4);

      retrieveCreatedWebSockets()[3].onclose();
      await waitSeconds(4);
      expect(WebSocket).toHaveBeenCalledTimes(5);

      retrieveCreatedWebSockets()[4].onopen();
      await webSockets[4].ready;
      expect(WebSocket).toHaveBeenCalledTimes(5);

      // First attempt failed to connect so there was no subscribe call
      expect(webSockets[0].send).toHaveBeenCalledTimes(0);

      // Second attempt succeed to connect so there were two subscribe calls
      expect(webSockets[1].send).toHaveBeenCalledTimes(2);
      expect(webSockets[1].send).toHaveBeenCalledWith('sub http://retry.com/docs/1');
      expect(webSockets[1].send).toHaveBeenCalledWith('sub http://retry.com/docs/2');

      // After a close event the third and forth attempts failed to connect
      expect(webSockets[2].send).toHaveBeenCalledTimes(0);
      expect(webSockets[3].send).toHaveBeenCalledTimes(0);

      // The Fifth attempt succeed to connect so there were two subscribe calls
      expect(webSockets[4].send).toHaveBeenCalledTimes(2);
      expect(webSockets[4].send).toHaveBeenCalledWith('sub http://retry.com/docs/1');
      expect(webSockets[4].send).toHaveBeenCalledWith('sub http://retry.com/docs/2');
    });
  });
});

async function waitForPromises(count = 10) {
  while (count-- > 0)
    await Promise.resolve();
}

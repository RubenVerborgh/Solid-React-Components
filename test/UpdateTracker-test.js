import UpdateTracker from '../src/UpdateTracker';
import auth from 'solid-auth-client';
import ldflex from '@solid/query-ldflex';

const WebSocket = global.WebSocket = jest.fn(() => ({
  send: jest.fn(),
}));

describe('An UpdateTracker', () => {
  const callback = jest.fn();
  let updateTracker, webSockets;

  jest.useFakeTimers();

  beforeAll(() => {
    updateTracker = new UpdateTracker(callback);
  });

  describe('subscribing to 3 resources', () => {
    const resources = [
      'http://a.com/docs/1',
      'http://a.com/docs/2',
      'http://b.com/docs/3',
      'http://b.com/docs/3#thing',
    ];
    beforeAll(() => {
      WebSocket.mockClear();
      updateTracker.subscribe(...resources);
      webSockets = WebSocket.mock.results.map(s => s.value);
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
      beforeAll(() => {
        WebSocket.mockClear();
        webSockets.forEach(s => s.send.mockClear());
        updateTracker.subscribe(...otherResources);
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
      beforeAll(() => {
        callback.mockClear();
        updateTracker.unsubscribe(
          'http://a.com/docs/1#235',
          'http://a.com/other',
        );
      });

      it('does not call the callback when the resource changes', () => {
        webSockets[0].onmessage({ data: 'pub http://a.com/docs/1' });
        expect(callback).toHaveBeenCalledTimes(0);
      });
    });

    describe('after resubscribing to a resource previously unsubscribed to', () => {
      beforeAll(() => {
        WebSocket.mockClear();
        updateTracker.subscribe(
          'http://a.com/docs/1#235',
          'http://a.com/other',
        );
        webSockets = WebSocket.mock.results.map(s => s.value);
        webSockets.forEach(s => s.onopen());
      });

      it('will reconnected and resubscribe for resource changes', () => {
        expect(WebSocket).toHaveBeenCalledTimes(1);
        expect(WebSocket).toHaveBeenCalledWith('ws://a.com/');

        expect(webSockets[0].send).toHaveBeenCalledTimes(2);
        expect(webSockets[0].send).toHaveBeenCalledWith('sub http://a.com/docs/1');
        expect(webSockets[0].send).toHaveBeenCalledWith('sub http://a.com/other');
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
      beforeAll(() => {
        updateTracker.subscribe('*');
        webSockets = WebSocket.mock.results.map(s => s.value);
        webSockets.forEach(s => s.onopen());
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
      beforeAll(() => {
        WebSocket.mockClear();
        auth.emit('request', 'https://z.com/1');
        auth.emit('request', 'https://z.com/2');
        webSockets = WebSocket.mock.results.map(s => s.value);
        webSockets.forEach(s => s.onopen());
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

  describe('retry subscriptions to resources', () => {
    beforeEach(async () => {
      WebSocket.mockClear();
      updateTracker.subscribe('http://retry.com/docs/1', 'http://retry.com/docs/2');
      webSockets = WebSocket.mock.results.map(s => s.value);
      WebSocket.mockClear();
    });

    afterEach(async () => {
      updateTracker.unsubscribe('http://retry.com/docs/1', 'http://retry.com/docs/2');
    });

    it('will resubscribe when onclose event occurs', async () => {
      webSockets[0].onclose();
      await advanceTimer(1000);

      webSockets = WebSocket.mock.results.map(s => s.value);
      webSockets[0].onopen();

      await Promise.resolve(); // allow any pending jobs in the PromiseJobs queue to run

      expect(WebSocket).toHaveBeenCalledTimes(1);
      expect(WebSocket).toHaveBeenCalledWith('ws://retry.com/');

      expect(webSockets[0].send).toHaveBeenCalledTimes(2);
      expect(webSockets[0].send).toHaveBeenCalledWith('sub http://retry.com/docs/1');
      expect(webSockets[0].send).toHaveBeenCalledWith('sub http://retry.com/docs/2');
    });

    it('will not resubscribe until backoff time occurrs', async () => {
      webSockets[0].onclose();
      await advanceTimer(500); // backoff time not exceeded yet!

      expect(WebSocket).toHaveBeenCalledTimes(0);

      await advanceTimer(500); // backoff time has not been exceeded.

      webSockets = WebSocket.mock.results.map(s => s.value);
      webSockets[0].onopen();

      await Promise.resolve(); // allow any pending jobs in the PromiseJobs queue to run

      expect(WebSocket).toHaveBeenCalledTimes(1);
      expect(WebSocket).toHaveBeenCalledWith('ws://retry.com/');

      expect(webSockets[0].send).toHaveBeenCalledTimes(2);
      expect(webSockets[0].send).toHaveBeenCalledWith('sub http://retry.com/docs/1');
      expect(webSockets[0].send).toHaveBeenCalledWith('sub http://retry.com/docs/2');
    });

    it('will make six attempts to resubscribe until a connection can be made', async () => {
      webSockets[0].onclose();
      await advanceTimer(1000);

      webSockets = WebSocket.mock.results.map(s => s.value);
      webSockets[0].onclose();
      await advanceTimer(2000);

      webSockets = WebSocket.mock.results.map(s => s.value);
      webSockets[1].onclose();
      await advanceTimer(4000);

      webSockets = WebSocket.mock.results.map(s => s.value);
      webSockets[2].onclose();
      await advanceTimer(8000);

      webSockets = WebSocket.mock.results.map(s => s.value);
      webSockets[3].onclose();
      await advanceTimer(16000);

      webSockets = WebSocket.mock.results.map(s => s.value);
      webSockets[4].onclose();
      await advanceTimer(32000);

      webSockets = WebSocket.mock.results.map(s => s.value);
      webSockets[5].onopen();

      await Promise.resolve(); // allow any pending jobs in the PromiseJobs queue to run

      expect(WebSocket).toHaveBeenCalledTimes(6);
      expect(WebSocket).toHaveBeenCalledWith('ws://retry.com/');

      // First five attemps failed to connect so there was no subscribe calls
      expect(webSockets[0].send).toHaveBeenCalledTimes(0);
      expect(webSockets[1].send).toHaveBeenCalledTimes(0);
      expect(webSockets[2].send).toHaveBeenCalledTimes(0);
      expect(webSockets[3].send).toHaveBeenCalledTimes(0);
      expect(webSockets[4].send).toHaveBeenCalledTimes(0);

      // The sixth attemps succeeded to connect so there was a subscribe calls
      expect(webSockets[5].send).toHaveBeenCalledTimes(2);
      expect(webSockets[5].send).toHaveBeenCalledWith('sub http://retry.com/docs/1');
      expect(webSockets[5].send).toHaveBeenCalledWith('sub http://retry.com/docs/2');
    });

    it('will not retry after the sixth attempt if the connection can not be made', async () => {
      WebSocket.mockClear();

      webSockets[0].onclose();
      await advanceTimer(1000);

      webSockets = WebSocket.mock.results.map(s => s.value);
      webSockets[0].onclose();
      await advanceTimer(2000);

      webSockets = WebSocket.mock.results.map(s => s.value);
      webSockets[1].onclose();
      await advanceTimer(4000);

      webSockets = WebSocket.mock.results.map(s => s.value);
      webSockets[2].onclose();
      await advanceTimer(8000);

      webSockets = WebSocket.mock.results.map(s => s.value);
      webSockets[3].onclose();
      await advanceTimer(16000);

      webSockets = WebSocket.mock.results.map(s => s.value);
      webSockets[4].onclose();
      await advanceTimer(32000);

      webSockets = WebSocket.mock.results.map(s => s.value);
      webSockets[5].onclose();
      await advanceTimer(32000);

      expect(WebSocket).toHaveBeenCalledTimes(6);
      expect(WebSocket).toHaveBeenCalledWith('ws://retry.com/');

      // All five attemps failed to connect so there was no subscribe calls
      expect(webSockets[0].send).toHaveBeenCalledTimes(0);
      expect(webSockets[1].send).toHaveBeenCalledTimes(0);
      expect(webSockets[2].send).toHaveBeenCalledTimes(0);
      expect(webSockets[3].send).toHaveBeenCalledTimes(0);
      expect(webSockets[4].send).toHaveBeenCalledTimes(0);
      expect(webSockets[5].send).toHaveBeenCalledTimes(0);
    });

    it('will reset resubscribes backoff connection is dropping and comming back up', async () => {
      webSockets[0].onclose();
      await advanceTimer(1000);

      webSockets = WebSocket.mock.results.map(s => s.value);
      webSockets[0].onclose();
      await advanceTimer(2000);

      webSockets = WebSocket.mock.results.map(s => s.value);
      webSockets[1].onopen(); // Connection succeeded which should reset backoff times
      await Promise.resolve(); // allow any pending jobs in the PromiseJobs queue to run

      // Backoff timeouts have been reset back to original times
      webSockets = WebSocket.mock.results.map(s => s.value);
      webSockets[1].onclose();
      await advanceTimer(1000);

      webSockets = WebSocket.mock.results.map(s => s.value);
      webSockets[2].onclose();
      await advanceTimer(2000);

      webSockets = WebSocket.mock.results.map(s => s.value);
      webSockets[3].onclose();
      await advanceTimer(4000);

      webSockets = WebSocket.mock.results.map(s => s.value);
      webSockets[4].onopen();

      await Promise.resolve(); // allow any pending jobs in the PromiseJobs queue to run

      expect(WebSocket).toHaveBeenCalledTimes(5);
      expect(WebSocket).toHaveBeenCalledWith('ws://retry.com/');

      // First attempst failed to connect so there was no subscribe calls
      expect(webSockets[0].send).toHaveBeenCalledTimes(0);

      // Second attempt succeed to connect so there was two subscribe calls
      expect(webSockets[1].send).toHaveBeenCalledTimes(2);
      expect(webSockets[1].send).toHaveBeenCalledWith('sub http://retry.com/docs/1');
      expect(webSockets[1].send).toHaveBeenCalledWith('sub http://retry.com/docs/2');

      // After a close event the third and forth attempts failed to connect
      expect(webSockets[2].send).toHaveBeenCalledTimes(0);
      expect(webSockets[3].send).toHaveBeenCalledTimes(0);

      // The Fifth attempt succeed to connect so there was two subscribe calls
      expect(webSockets[4].send).toHaveBeenCalledTimes(2);
      expect(webSockets[4].send).toHaveBeenCalledWith('sub http://retry.com/docs/1');
      expect(webSockets[4].send).toHaveBeenCalledWith('sub http://retry.com/docs/2');
    });
  });

  function advanceTimer(milliseconds) {
    jest.advanceTimersByTime(milliseconds);
    return Promise.resolve(); // allow any pending jobs in the PromiseJobs queue to run
  }
});

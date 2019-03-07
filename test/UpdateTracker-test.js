import UpdateTracker from '../src/UpdateTracker';
import data from '@solid/query-ldflex';

const WebSocket = global.WebSocket = jest.fn(() => ({
  send: jest.fn(),
}));

describe('An UpdateTracker', () => {
  const callback = jest.fn();
  let updateTracker;
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
    let webSockets;
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
        data.clearCache.mockClear();
        webSockets[0].onmessage({ data: 'pub http://a.com/other' });
      });

      it('does not call the subscriber', () => {
        expect(callback).toHaveBeenCalledTimes(0);
      });

      it('clears the LDflex cache', () => {
        expect(data.clearCache).toHaveBeenCalledTimes(1);
        expect(data.clearCache).toHaveBeenCalledWith('http://a.com/other');
      });
    });

    describe('after a tracked resource changes', () => {
      beforeAll(() => {
        callback.mockClear();
        data.clearCache.mockClear();
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
        expect(data.clearCache).toHaveBeenCalledTimes(1);
        expect(data.clearCache).toHaveBeenCalledWith('http://a.com/docs/1');
      });
    });

    describe('after an unknown message arrives for a tracked resource ', () => {
      beforeAll(() => {
        callback.mockClear();
        data.clearCache.mockClear();
        webSockets[0].onmessage({ data: 'ack http://a.com/docs/1' });
      });

      it('does not call the subscriber', () => {
        expect(callback).toHaveBeenCalledTimes(0);
      });

      it('does not clear the LDflex cache', () => {
        expect(data.clearCache).toHaveBeenCalledTimes(0);
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
  });
});

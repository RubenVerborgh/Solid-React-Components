import EventEmitter from 'events';

class SolidAuthClient extends EventEmitter {
  constructor() {
    super();
    this.session = null;
  }

  popupLogin() {}

  logout() {}

  trackSession(callback) {
    callback(this.session);
    this.on('session', callback);
  }

  mockWebId(webId) {
    this.session = webId ? { webId } : null;
    this.emit('session', this.session);
    return new Promise(resolve => setImmediate(resolve));
  }
}

const instance = new SolidAuthClient();
jest.spyOn(instance, 'popupLogin');
jest.spyOn(instance, 'logout');
jest.spyOn(instance, 'removeListener');

export default instance;

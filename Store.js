export default class Store {
  constructor(data) {
    this.onListener = {};
    this.onceListener = {};
    const proxyData = { ...data };
    this.data = () => new Proxy(
      proxyData,
      this._proxyHandlerFactory(
        (handler, target, key) => new Proxy(target[key], handler),
        undefined)
    );
  }

  on(key, listener){
    if (!this.onListener[key]) this.onListener[key] = [];
    this.onListener[key].push(listener);
    return {
      remove: () => this.onListener[key] = this.onListener[key].filter(el => el !== listener),
    };
  }
  once(key, listener){
    if (!this.onceListener[key]) this.onceListener[key] = [];
    this.onceListener[key].push(listener);
    return {
      remove: () => this.onceListener[key] = this.onceListener[key].filter(el => el !== listener),
    }
  }

  removeOn(key){
    delete this.onListener[key];
  }
  removeOnce(key){
    delete this.onceListener[key];
  }

  _proxyHandlerFactory(
    next = (handler, target, key) => target[key],
    parentKeys = []
  ){
    return {
      get: (target, key) => {
        if (typeof target[key] === 'object'){
          parentKeys.push(key);
          return next(this._proxyHandlerFactory(next, parentKeys), target, key);
        }
        return target[key];
      },
      set: (target, key, value) => {
        if (target[key] === value) return true;
        const old = target[key];
        target[key] = value;
        const rootKey = parentKeys[0] ?? key;
        this.onListener[rootKey]?.forEach(listener => {
          listener({ key, value, target, new: value, old });
        });
        this.onceListener[rootKey]?.pop()?.({ key, value, target, new: value, old });
        return true;
      },
    }
  }
}

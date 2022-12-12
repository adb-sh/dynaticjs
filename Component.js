import { camelToSnake } from "./helpers.js";

export default class Component {
  constructor(DOMElement = document.createElement('template'), {router} = {}) {
    this.$el = DOMElement;
    this.slot = this.$el ? [...this.$el.childNodes] : null;
    this.attributes = this.$el.attributes;
    this.$components = {};
    this.$refs = {};
    this.$props = {};
    this.config = this.init() ?? {};
    this.$router = router;
    this.proxyHandler = {
      get: (target, key) => {
        if (key === 'deepWatch' && typeof target[key] === 'object') return new Proxy(target[key], this.deepProxyHandler);
        return target[key];
      },
      set: (target, key, value) => {
        if (target[key] === value) return true;
        target[key] = value;
        this.mount().setup();
        return true;
      },
    };
    this.deepProxyHandler = {
      get: (target, key) => {
        if (typeof target[key] === 'object') return new Proxy(target[key], this.deepProxyHandler);
        return target[key];
      },
      set: (target, key, value) => {
        if (target[key] === value) return true;
        target[key] = value;
        this.mount().setup();
        return true;
      }
    };
    const data = this.data();
    this.data = actions => new Proxy(data, this._proxyHandlerFactory(undefined, undefined, actions));
  }

  init() {
  }

  data(actions) {
    return {};
  }

  render() {
    return `<!-- empty element -->`;
  }

  mount(DOMElement = this.$el) {
    if (this.$el !== DOMElement) this.$el = DOMElement;
    const temp = document.createElement('template');
    temp.innerHTML = this.render(this).trim();
    if (temp.content.childNodes.length !== 1) throw new Error(`template requires exactly one root element`);
    this.$refs = {};
    temp.content.querySelectorAll('[ref]').forEach(el => {
      const key = el.getAttribute('ref').trim();
      if (this.$refs[key] === undefined) {
        this.$refs[key] = el;
        return;
      }
      if (!Array.isArray(this.$refs[key])) this.$refs[key] = [this.$refs[key]];
      this.$refs[key].push(el);
    });
    if (this.config.components) Object.entries(this.config.components).forEach(([key, Component]) => {
      this.$components[key] = [...temp.content.querySelectorAll(camelToSnake(key))].map(el => {
        const component = new Component(el, {router: this.$router});
        if (component.config.props) Object.entries(component.config.props)?.forEach(([key, type]) => {
          const parentKey = el.getAttribute(`bind:${key}`);
          if (!parentKey) throw new Error(`prop ${key} not defined for component`);
          component.$props[key] = this.data()[parentKey];
          this.data([])[parentKey] = new Proxy(
            component.$props[key],
            component.deepProxyHandler,
          );
        });
        component.mount().setup();
        return component;
      });
    });
    if (this.slot) temp.content.querySelectorAll('slot').forEach(el => {
      el.replaceWith(...[...this.slot].map(el => el.cloneNode()));
    });
    const newDOMElement = temp.content.firstChild;
    this.$el.replaceWith(newDOMElement);
    this.$el = newDOMElement;
    return this;
  }

  setup() {
  }

  _proxyHandlerFactory(
    next = (handler, target, key) => target[key],
    parentKeys = [],
    callbackKeys = ['mount', 'setup']
  ) {
    return {
      get: (target, key) => {
        if (typeof target[key] === 'object') {
          parentKeys.push(key);
          return next(this._proxyHandlerFactory(next, parentKeys), target, key);
        }
        return target[key];
      },
      set: (target, key, value) => {
        if (target[key] === value) return true;
        target[key] = value;
        if (parentKeys.length === 0 || parentKeys[0] === 'deepWatch') {
          callbackKeys.forEach(key => {
            this[key]();
          });
        }
        return true;
      },
    }
  }
};

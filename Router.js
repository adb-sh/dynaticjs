import NotFound from "./pages/NotFound.js";

export default class Router {
  constructor({rootElement, routes, onRefresh=()=>{}}) {
    this.$el = rootElement;
    this.routes = [...routes].map(({ Component, ...props })=>({ component: new Component(undefined, { router: this }), ...props}));
    this.fallbackComponent = new NotFound();
    this.onRefresh = onRefresh;
    this.currentRoute = undefined;

    window.addEventListener('locationchange', event => {
      this.refresh();
    });
    window.addEventListener('popstate', event => {
      this.refresh();
    });
    window.addEventListener('routerLinkClick', ({ detail: route }) => {
      this.push(route.name);
    });
    this.refresh();
  }
  refresh(path = window.location.pathname){
    this.currentRoute = this.routes.find(el => el.path === path);
    const component = this.currentRoute?.component ?? this.fallbackComponent;
    if (!component) throw new Error(`no route defined for ${path}!`);
    component.mount(this.$el);
    this.$el = component.$el;
    component.setup({ router: this });
    this.onRefresh({ path, router: this });
  }
  push(routeName){
    const route = this.routes.find(el => el.name === routeName);
    history.pushState({name: route.name}, route.name, route.path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    if (route.path !== this.currentRoute.path) this.refresh(route.path);
  }
};

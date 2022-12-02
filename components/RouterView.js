import Component from "../Component.js";
import Router from "../Router.js";
import { propFactory } from "../helpers.js";

export default class RouterView extends Component {
  init() {
    return {
      props: {
        routes: propFactory([]),
      },
    };
  }

  render() {
    return `<div class="routerView"></div>`;
  }
  setup() {
    new Router({
      rootElement: this.$el,
      routes: this.$props.routes.value,
    });
  }
}

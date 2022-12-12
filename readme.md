# DynaticJS

a simple reactive runtime JS framework inspired by Vue

- boilerplate repo: [github.com/adb-sh/dynaticjs-boilerplate](https://github.com/adb-sh/dynaticjs-boilerplate)
- npm: [npmjs.com/package/dynaticjs](https://www.npmjs.com/package/dynaticjs)

## current features
- dynamic router
- components (recursive)
- data binding (from component to component)
- trigger rerender components on data change
- scoped references to DOM elements

## simple component example
```javascript
import Component from "dynaticjs/Component";
import { propFactory } from "dynaticjs/helpers.js";
import RouterLink from "dynaticjs/components/RouterLink.js";
import RouterView from "dynaticjs/components/RouterView.js";
import Home from "./pages/Home.js";

export default class App extends Component {
  init() {
    return {
      components: {
        RouterLink,
        RouterView,
      },
    };
  }

  data() {
    return {
      routes: propFactory([
        {
          name: 'home',
          title: 'Home',
          path: '/',
          Component: Home,
        },
      ]),
    };
  }

  render(state) {
    return `
      <div id="app">
        <nav ref="nav">
          <router-link class="btn btn-primary" to="home">Home</router-link>
          <router-link class="btn btn-primary" to="about">About</router-link>
        </nav>
        <main>
          <h1>DynaticJS Boilerplate</h1>
          <router-view bind:routes="routes"></router-view>  
        </main>
      </div>
    `;
  }

  setup() {
    console.log("Hello World :D");
    console.log("#app element", this.$el); //corresponding DOM element
    console.log("nav element", this.$refs.nav); //scoped reference to DOM element with the attribute `ref="nav"`
    console.log("child components in App", this.$components) //references to child components
  }
};
```
[full example](https://github.com/adb-sh/dynaticjs-boilerplate/blob/master/src/App.js)

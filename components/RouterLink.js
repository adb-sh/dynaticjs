import Component from "../Component.js";

export default class RouterLink extends Component {
  render() {
    return `<a class="routerLink"><slot></slot></a>`;
  }
  setup() {
    this.$el.addEventListener('click', ev => {
      ev.preventDefault();
      window.dispatchEvent(new CustomEvent('routerLinkClick', { detail: {
        name: this.attributes.to.value,
      }}));
    });
  }
}

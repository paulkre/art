import "./app.css";

import { createApp, defineAsyncComponent } from "vue";

import App from "./App.vue";

const components = import.meta.glob("./components/*.vue");

const app = createApp(App);

Object.entries(components).forEach(([path, component]) => {
  const name = path.match(/\.\/components\/(.*)\.vue$/)[1];
  app.component(name, defineAsyncComponent(component));
});

app.mount("#app");

import { createApp, defineAsyncComponent } from "vue";

export * from "vue";
export * from "./lib/index.js";

import "./app.css";

export const components = Object.fromEntries(
  Object.entries(import.meta.globEager("./components/*.vue")).map(
    ([path, component]) => {
      const name = path.match(/\.\/components\/(.*)\.vue$/)[1];
      return [name, component];
    }
  )
);

const components2 = import.meta.glob("./components/*.vue");

export const createElektronApp = (appComponent = {}) => {
  const app = createApp(appComponent);
  Object.entries(components2).forEach(([path, component]) => {
    const name = path.match(/\.\/components\/(.*)\.vue$/)[1];
    app.component(name, defineAsyncComponent(component));
  });

  return app;
};

//export { defineAsyncComponent };
//export const components = import.meta.globEager("./components/*.vue");
// const components = Object.fromEntries(
//   Object.entries(import.meta.glob("./components/*.vue")).map(
//     ([path, component]) => {
//       const name = path.match(/\.\/components\/(.*)\.vue$/)[1];
//       return [name, defineAsyncComponent(component)];
//     }
//   )
// );

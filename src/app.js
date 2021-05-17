import "./app.css";

import { createApp, defineAsyncComponent } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";

const components = import.meta.globEager("./components/*.vue");
const routes = [
  {
    path: "/",
    component: () => import(`./pages/Index.vue`),
  },
  {
    path: "/strapi/page/:page_slug",
    component: () => import(`./pages/StrapiPage.vue`),
  },
  {
    path: "/strapi/:festival_slug/:event_slug",
    component: () => import(`./pages/StrapiEvent.vue`),
  },
  {
    path: "/strapi/:festival_slug",
    component: () => import(`./pages/StrapiFestival.vue`),
  },
  {
    path: "/strapi",
    component: () => import(`./pages/StrapiIndex.vue`),
  },
  {
    path: "/synth",
    component: () => import(`./pages/Synth.vue`),
  },
  {
    path: "/page/:pageid",
    component: () => import("./pages/Page.vue"),
  },
  {
    path: "/:eventid",
    component: () => import("./pages/Event.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.use(router);

Object.entries(components).forEach(([path, component]) => {
  const name = path.match(/\.\/components\/(.*)\.vue$/)[1];
  app.component(name, component.default);
});

app.mount("#app");

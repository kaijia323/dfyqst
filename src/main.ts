import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "@/styles/index.scss";
import "normalize.css";
import pinia from "./pinia";
import { useComponents } from "./components";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(router);
app.use(pinia);
useComponents(app);
app.mount("#app");

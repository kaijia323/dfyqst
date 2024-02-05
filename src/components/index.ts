import type { App } from "vue";
import dfLabelVue from "./df-label.vue";
import dfTags from "./df-tags.vue";

const components = [dfLabelVue, dfTags];

export const useComponents = (app: App) => {
  for (const component of components) {
    app.component(component.name, component);
  }
};

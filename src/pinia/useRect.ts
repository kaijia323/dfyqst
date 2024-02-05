// 获取布局的宽高

import { defineStore } from "pinia";

export const useRectStore = defineStore("rectStore", {
  state: () => ({
    rect: {
      width: 0,
      height: 0,
    },
  }),
  getters: {
    with: state => state.rect.width,
    height: state => state.rect.height,
  },
});

const routes = [
  {
    path: "/",
    component: () => import("@/layout/index.vue"),
    redirect: "/xiyouguke",
    children: [
      {
        path: "/xiyouguke",
        name: "xiyouguke",
        component: () => import("@/views/xiyouguke/index.vue"),
        meta: {
          title: "稀有顾客",
        },
      },
      {
        path: "/shicai",
        name: "shicai",
        component: () => import("@/views/shicai/index.vue"),
        meta: {
          title: "食材",
        },
      },
      {
        path: "/jiushui",
        name: "jiushui",
        component: () => import("@/views/jiushui/index.vue"),
        meta: {
          title: "酒水",
        },
      },
      {
        path: "/shipu",
        name: "shipu",
        component: () => import("@/views/shipu/index.vue"),
        meta: {
          title: "食谱",
        },
      },
    ],
  },
];

export default routes;

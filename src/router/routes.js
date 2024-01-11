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
      },
      {
        path: "/shicai",
        name: "shicai",
        component: () => import("@/views/shicai/index.vue"),
      },
    ],
  },
];

export default routes;

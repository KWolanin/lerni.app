import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/login',
        component: () => import('pages/LoginPage.vue'),
      },
      {
        path: '/premium',
        component: () => import('pages/PaymentPage.vue'),
      },
      {
        path: '/credits',
        component: () => import('pages/CreditsInfo.vue'),
      },
      {
        path: '/about',
        component: () => import('pages/AboutApp.vue'),
      },
      {
        path: '/contact',
        component: () => import('pages/ContactInfo.vue'),
      }
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

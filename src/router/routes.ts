import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'signUp', component: () => import('src/pages/SignUpPage.vue') },
      { path: 'logIn', component: () => import('src/pages/LogInPage.vue') },
      { path: '/note/:id', component: () => import('pages/NotePage.vue') },
    ],
  },
  {
    path: '/main',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/MainPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

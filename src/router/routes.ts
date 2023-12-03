import { RouteRecordRaw } from 'vue-router';
import { MenuEnum } from '@/enums/common.enum';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: MenuEnum.Home,
        component: () => import('pages/Home.vue'),
      },

      {
        path: 'player',
        name: MenuEnum.Player,
        component: () => import('pages/player/Player.vue'),
        redirect: {
          name: MenuEnum.PlayerTable,
        },
        children: [
          {
            path: '',
            name: MenuEnum.PlayerTable,
            component: () => import('pages/player/PlayerTable.vue'),
          },
          {
            path: '',
            name: MenuEnum.PlayerAdd,
            component: () => import('pages/player/PlayerAdd.vue'),
          },
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

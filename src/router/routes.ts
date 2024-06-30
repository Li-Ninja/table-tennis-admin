import { RouteRecordRaw } from 'vue-router';
import { MenuEnum } from '@/enums/common.enum';
import { useLocalStorage } from '@/utils/localStorage.util';

const { getToken } = useLocalStorage();

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: async (_to, _from, next) => {
      // TODO need validate token is valid
      if (!getToken()) {
        next({ name: MenuEnum.Login });
      } else {
        next();
      }
    },
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
      {
        path: 'result',
        name: MenuEnum.Result,
        component: () => import('pages/result/Result.vue'),
        redirect: {
          name: MenuEnum.ResultTable,
        },
        children: [
          {
            path: '',
            name: MenuEnum.ResultTable,
            component: () => import('pages/result/ResultTable.vue'),
          },
          {
            path: '',
            name: MenuEnum.ResultAdd,
            component: () => import('pages/result/ResultAdd.vue'),
          },
          {
            path: '',
            name: MenuEnum.ResultRankingAdd,
            component: () => import('pages/result/ResultRankingAdd.vue'),
          },
        ],
      },
      {
        path: 'changeLog',
        name: MenuEnum.ChangeLog,
        component: () => import('pages/changeLog/ChangeLog.vue'),
        redirect: {
          name: MenuEnum.ChangeLogTable,
        },
        children: [
          {
            path: '',
            name: MenuEnum.ChangeLogTable,
            component: () => import('pages/changeLog/ChangeLogTable.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    redirect: MenuEnum.Login,
    children: [
      {
        path: 'login',
        name: MenuEnum.Login,
        component: () => import('pages/Login.vue'),
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

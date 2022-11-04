export const routes = [{
  name: '',
  path: '/',
  component: () => import('/src/views/index.vue'),
  children: [{
    name: '/c',
    path: '/c',
    component: () => import('/src/views/C.vue'),
  },
  {
    name: '/a',
    path: '/a',
    component: () => import('/src/views/a/index.vue'),
    children: [{
      name: '/a/a-1',
      path: '/a/a-1',
      component: () => import('/src/views/a/a-1.vue'),
    },
    ],
  },
  {
    name: '/b',
    path: '/b',
    component: () => import('/src/views/b/index.vue'),
    children: [{
      name: '/b/B-1',
      path: '/b/B-1',
      component: () => import('/src/views/b/B-1.vue'),
    },
    ],
  },
  {
    name: '/match',
    path: '/match',
    component: () => import('/src/views/match/index.vue'),
    children: [{
      name: '/match/[id]',
      path: '/match/[id]',
      component: () => import('/src/views/match/[id].vue'),
    },
    ],
  }],
}]

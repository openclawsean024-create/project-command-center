export default [
  {
    path: '/projects',
    name: 'projects',
    icon: 'dashboard',
    component: './ProjectCommandCenter',
  },
  {
    path: '/',
    redirect: '/projects',
  },
  {
    path: '*',
    redirect: '/projects',
  },
];

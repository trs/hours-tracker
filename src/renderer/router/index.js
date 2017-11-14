import Vue from 'vue';
import Router from 'vue-router';

import IdlePage from '@/components/IdlePage';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: IdlePage
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});

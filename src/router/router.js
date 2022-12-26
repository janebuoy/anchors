import Vue from 'vue';
import VueRouter from 'vue-router';
import LeafletMap from '../views/LeafletMap.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'LeafletMap',
    component: LeafletMap,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;

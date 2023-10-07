import Vue from 'vue';
import VueRouter from 'vue-router';
import LeafletMap from '../views/LeafletMap.vue';
import store from '../store/store.js'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'LeafletMap',
    component: LeafletMap,
  },
	{
    path: '/:uuid',
    component: LeafletMap,
		props: true,
		children: [
			{
				path: ':id',
				component: LeafletMap,
				props: true
			}
		]
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
	store.commit('setRoute', to)
	next()
})

export default router;

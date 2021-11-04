import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueChatScroll from 'vue-chat-scroll';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.min.css'
import 'leaflet/dist/leaflet.css'

import '@/scss/styles.scss';
import '@/scss/_overrides.scss';

Vue.config.productionTip = false
Vue.use(VueChatScroll);

export const eventBus = new Vue();

window.player = null;

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App)
}).$mount('#app')

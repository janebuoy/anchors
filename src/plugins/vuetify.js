import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		themes: {
			light: {
				primary: '#36315B',
				secondary: '#8E8991',
				accent: '#843B62',
				error: '#C35755',
				info: '#EECF6D',
				success: '#B5B682',
				warning: '#D57A66',
			}
		}
	},
});

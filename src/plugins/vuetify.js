import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		options: { customProperties: true },
		themes: {
			light: {
				background: "#FFFFFF",
				primary: {
					base: '#1c1b1d',
					lighten1: "#333234",
					lighten2: "#49494a",
					lighten3: "#605f61",
					lighten4: "#777677",
					darken1: "#19181a",
					darken2: "#161617",
					darken3: "#141314",
					darken4: "#111011",
				},
				secondary: {
					base: '#1a766d',
					lighten1: "#31847c",
					lighten2: "#48918a",
					lighten3: "#5f9f99",
					lighten4: "#76ada7",
					darken1: "#155e57",
					darken2: "#104741",
					darken3: "#0a2f2c",
					darken4: "#051816",
				},
				tertiary: {
					base: '#cc4646',
					lighten1: "#d15959",
					lighten2: "#d66b6b",
					lighten3: "#db7e7e",
					lighten4: "#e09090",
					darken1: "#b83f3f",
					darken2: "#a33838",
					darken3: "#8f3131",
					darken4: "#7a2a2a",
				},
				accent: {
					base: colors.yellow.base,
					lighten1: colors.yellow.lighten1,
					lighten2: colors.yellow.lighten2,
					lighten3: colors.yellow.lighten3,
					lighten4: colors.yellow.lighten4,
					darken1: colors.yellow.darken1,
					darken2: colors.yellow.darken2,
					darken3: colors.yellow.darken3,
					darken4: colors.yellow.darken4,
				},
				neutral: {
					base: '#8e8991',
					lighten1: "#a5a1a7",
					lighten2: "#bbb8bd",
					lighten3: "#d2d0d3",
					lighten4: "#e8e7e9",
					darken1: "#726e74",
					darken2: "#555257",
					darken3: "#39373a",
					darken4: "#1c1b1d",
				},
				grey: {
					base: colors.grey.lighten1,
					lighten1: colors.grey.lighten1,
					lighten2: colors.grey.lighten2,
					lighten3: colors.grey.lighten3,
					lighten4: colors.grey.lighten4,
					darken1: colors.grey.darken1,
					darken2: colors.grey.darken2,
					darken3: colors.grey.darken3,
					darken4: colors.grey.darken4,
				},
				error: {
					base: "#E25455",
					lighten1: "#e56364",
					lighten2: "#efa2a2",
					lighten3: "#fae0e0",
					darken1: "#9c1a1b",
					darken2: "#5d1010",
					darken3: "#1f0505"
				},
				warning: {
					base: "#E68E00",
					lighten1: "#FCB849",
					lighten2: "#ffdb92",
					lighten3: "#fff3db",
					darken1: "#b67900",
					darken2: "#6d4900",
					darken3: "#241800"
				},
				success: {
					base: "#47b857",
					lighten1: "#7bcc87",
					lighten2: "#b0e1b7",
					lighten3: "#e5f5e7",
					darken1: "#32843e",
					darken2: "#1e4f25",
					darken3: "#0a1a0c"
				},
			},
			dark: {
				background: "#1E1E1E"
			}
		}
	},
});

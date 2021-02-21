import Vue from 'vue'
import Vuex from 'vuex'

// Import numeric Icons
import mdi_numeric_0 from "../assets/svg/numeric-0-circle-bg.svg"
import mdi_numeric_1 from "../assets/svg/numeric-1-circle-bg.svg"
import mdi_numeric_2 from "../assets/svg/numeric-2-circle-bg.svg"
import mdi_numeric_3 from "../assets/svg/numeric-3-circle-bg.svg"
import mdi_numeric_4 from "../assets/svg/numeric-4-circle-bg.svg"
import mdi_numeric_5 from "../assets/svg/numeric-5-circle-bg.svg"
import mdi_numeric_6 from "../assets/svg/numeric-6-circle-bg.svg"
import mdi_numeric_7 from "../assets/svg/numeric-7-circle-bg.svg"
import mdi_numeric_8 from "../assets/svg/numeric-8-circle-bg.svg"
import mdi_numeric_9 from "../assets/svg/numeric-9-circle-bg.svg"
import mdi_numeric_10 from "../assets/svg/numeric-10-circle-bg.svg"

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		global: {
			bottomSheetHeight: null,
			drawerRightWidth: null,
			drawerLeft: null,
			contentDrawer: null
		},
		map: {
			title: null,
			currentUUID: null,
			activeLayers: ['route', 'scenes'],
			icons: [
				mdi_numeric_0,
				mdi_numeric_1,
				mdi_numeric_2,
				mdi_numeric_3,
				mdi_numeric_4,
				mdi_numeric_5,
				mdi_numeric_6,
				mdi_numeric_7,
				mdi_numeric_8,
				mdi_numeric_9,
				mdi_numeric_10
			]
		},
		content: null
	},
	actions: {
		// * Global Actions
		bottomSheetHeight(context, payload) {
			context.commit('bottomSheetHeight', payload)
		},
		drawerRightWidth(context, payload) {
			context.commit('drawerRightWidth', payload)
		},
		toggleDrawerLeft(context, payload) {
			context.commit('toggleDrawerLeft', payload)
		},
		toggleContentDrawer(context, payload) {
			context.commit('toggleContentDrawer', payload)
		},
		// * Map Actions
		updateState(context, payload) {
			context.commit('updateState', payload)
		}
	},
	mutations: {
		// * Global Mutations
		bottomSheetHeight: (state, payload) => {
			state.global.bottomSheetHeight = payload
		},
		drawerRightWidth: (state, payload) => {
			state.global.drawerRightWidth = payload
		},
		toggleDrawerLeft: (state, payload) => {
			if (state.global.drawerLeft !== payload) {
				state.global.drawerLeft = !state.global.drawerLeft
			}
		},
		toggleContentDrawer: (state, payload) => {
			if (state.global.contentDrawer !== payload) {
				state.global.contentDrawer = !state.global.contentDrawer
			}
		},
		// * Map Mutations
		updateState: (state, payload) => {
			state.map.currentUUID = payload.uuid
			state.map.title = payload.title
			state.map.activeLayers = payload.layers
			state.content = payload.content
			// state.app.title = payload.title
		},
	},
	getters: {
		// * Global Getters
		bottomSheetHeight: state => {
			return state.global.bottomSheetHeight
		},
		drawerRightWidth: state => {
			return state.global.drawerRightWidth
		},
		drawerLeft: state => {
			return state.global.drawerLeft
		},
		contentDrawer: state => {
			return state.global.contentDrawer
		},
		// * Map Getters
		activeLayers: state => {
			return state.map.activeLayers
		},
		markerIcons: state => {
			return state.map.icons
		},
		currentUUID: state => {
			return state.map.currentUUID
		},
		// * Content
		content: state => {
			if (state.content) {
				return state.content
			}
			else {
				return false
			}
		},
		resources: state => {
			if (state.content) {
				const resources = state.content.resources

				// for each type return corresponding icon
				const icons = {
					"audio": "mdi-headphones",
					"map": "mdi-map",
					"gallery": "mdi-file-presentation-box",
					"timeline": "mdi-timeline"
				}
				for (let value of Object.values(resources)) {
					value['icon'] = icons[value.type]
				}
				return resources
			}
			else {
				return false
			}
		},
	},
	modules: {

	}
})


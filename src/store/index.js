import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		global: {
			bottomSheetHeight: null,
			drawerRightWidth: null,
			drawerLeft: null,
			contentDrawer: null
		}
	},
	actions: {
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
	},
	mutations: {
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
	},
	getters: {
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
		}
	},
	modules: {

	}
})


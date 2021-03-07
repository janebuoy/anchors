import Vue from 'vue'
import Vuex from 'vuex'

import icons from "../assets/icons.json"

import axios from "axios";
const ax = axios.create({
	baseURL: process.env.BASE_URL,
});

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		global: {
			scenes: {
				url: "data/json/scenes.json",
				data: null,
			},
			bottomSheetHeight: null,
			drawerRightWidth: null,
			drawerLeft: false,
			contentDrawer: false,
			actionBounds: true,
		},
		map: {
			title: null,
			currentUUID: null,
			nextID: null,
			activeLayers: ['route', 'scenes'],
			icons: icons.icons
		},
		content: {
			object: null,
			currentItem: null,
			audio: {
				localSrc: null,
				localProgress: null,
				duration: 0,
				progress: 0,
				currentTime: 0,
				isPlaying: false,
			}
		}
	},
	actions: {
		// * Global Actions
		fetchScenes(context) {
			ax.get(context.state.global.scenes.url)
				.then(response => response.data)
				.then(scenes => {
					context.commit('setScenes', scenes)
				})
				.catch((err) => {
					console.log(err);
				});
		},
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
		},
		// Content Actions
		updateContentItem(context, payload) {
			context.commit('updateContentItem', payload)
		},
		updatePlayingState(context, payload) {
			context.commit("updatePlayingState", payload)
		},
		saveAudioState(context, payload) {
			context.commit("saveAudioState", payload)
		}
	},
	mutations: {
		// * Global Mutations
		setScenes: (state, payload) => {
			state.global.scenes.data = payload
		},
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
			state.map.nextID = payload.nextID
			state.map.title = payload.title
			state.map.activeLayers = payload.layers
			state.content.object = payload.content
			// state.app.title = payload.title
		},
		// Content Mutations
		updateContentItem: (state, payload) => {
			state.content.currentItem = payload
		},
		updatePlayingState: (state, payload) => {
			state.content.audio.isPlaying = payload
		},
		saveAudioState: (state, payload) => {
			state.content.audio = payload
		}
	},
	getters: {
		// * Global Getters
		scenes: state => {
			return state.global.scenes
		},
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
		useActionBounds: state => {
			return state.global.actionBounds
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
		nextID: state => {
			return state.map.nextID
		},
		noOfScenes: state => {
			return state.global.scenes.data.features.length
		},
		// * Content Getters
		content: state => {
			if (state.content.object) {
				return state.content.object
			}
			else {
				return false
			}
		},
		resources: state => {
			if (state.content.object) {
				const resources = state.content.object.resources

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
		currentItem: state => {
			return state.content.currentItem
		},
		savedAudioState: state => {
			return state.content.audio
		},
		isPlaying: state => {
			return state.content.audio.isPlaying
		},
		nextAudioID: (state, getters) => {
			let index = state.content.currentItem.id
			const resources = getters.resources

			while (index < resources.length - 1) {
				index++
				if (resources[index].type === 'audio') {
					return index
				}
			}
			return false
		},
		prevAudioID: (state, getters) => {
			let i = state.content.currentItem.id
			const resources = getters.resources

			while (i > 0) {
				i--
				if (resources[i].type === 'audio') {
					return i
				}
			}
			return false
		},
	},
	modules: {

	}
})


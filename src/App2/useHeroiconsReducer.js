import dataset from "./dataset"
import { useImmerReducer } from "use-immer"

import CodeSolidSVG from "heroicons-ecfba30/solid/Code"
import SwitchHorizontalSolidSVG from "heroicons-ecfba30/solid/SwitchHorizontal"

const initialState = {
	form: {
		search: "",
		copyAsReact: false,
		showOutline: false,
	},
	notif: {
		visible: false,
		notifType: "",
		notifInfo: null,
	},
	results: dataset,
}

const actions = state => ({

	/*
	 * state.form
	 */
	updateFormSearch(text) {
		text = text.toLowerCase()
		if (!text) {
			state.form.search = ""
			state.results = dataset
			return
		}
		state.form.search = text
		state.results = dataset.filter(each => {
			each.searchQueryIndex = each.name.indexOf(text)
			if (each.statusNew && text === "new") {
				return true
			}
			return each.searchQueryIndex >= 0
		})
		state.results.sort((a, b) => {
			return a.searchQueryIndex - b.searchQueryIndex
		})
	},
	toggleFormCopyAsReact() {
		state.form.copyAsReact = !state.form.copyAsReact
		this.updateNotification("form-jsx", {
			icon: CodeSolidSVG,
		})
	},
	toggleFormShowOutline() {
		state.form.showOutline = !state.form.showOutline
		this.updateNotification("form-alt", {
			icon: SwitchHorizontalSolidSVG,
		})
	},

	/*
	 * state.notif
	 */
	updateNotification(notifType, notifInfo) {
		state.notif.visible = true
		state.notif.notifType = notifType
		state.notif.notifInfo = notifInfo
	},
	hideNotification() {
		state.notif.visible = false
	},

})

function HeroiconsReducer(state, action) {
	switch (action.type) {
	case "UPDATE_FORM_SEARCH":
		actions(state).updateFormSearch(action.text)
		return
	case "TOGGLE_FORM_COPY_AS_REACT":
		actions(state).toggleFormCopyAsReact()
		return
	case "TOGGLE_FORM_SHOW_OUTLINE":
		actions(state).toggleFormShowOutline()
		return
	case "UPDATE_NOTIFICATION":
		actions(state).updateNotification(action.notifType, action.notifInfo)
		return
	case "HIDE_NOTIFICATION":
		actions(state).hideNotification()
		return
	default:
		throw new Error(`HeroiconsReducer: type mismatch; action.type=${action.type}`)
	}
}

function useHeroiconsReducer() {
	return useImmerReducer(HeroiconsReducer, {}, () => initialState)
}

export default useHeroiconsReducer

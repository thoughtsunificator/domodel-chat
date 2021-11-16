import { Binding } from "domodel"

import UsersEventListener from "./users.event.js"

/**
 * @global
 */
class UsersBinding extends Binding {

	/**
	 * @param {object} properties
	 * @param {Chat}   properties.chat
	 */
	constructor(properties) {
		super(properties, new UsersEventListener(properties.chat))
	}

	onCreated() {

		const { chat } = this.properties

		this.listen(chat, "channelUnset", () => {
			this.root.style.display = "none"
		})

		this.listen(chat, "channelUserLeft", () => {
			chat.emit("userCounterUpdate")
		})
	}

}

export default UsersBinding

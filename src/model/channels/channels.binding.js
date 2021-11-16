import { Binding } from "domodel"

import ChannelsEventListener from "./channels.event.js"

/**
 * @global
 */
class ChannelsBinding extends Binding {

	/**
	 * @param {object} properties
	 * @param {Chat}   properties.chat
	 */
	constructor(properties) {
		super(properties, new ChannelsEventListener(properties.chat))
	}

	onCreated() {

		const { chat } = this.properties

		this.identifier.network.addEventListener("click", () => {
			chat.emit("networkSet", chat.channel)
		})

	}

}

export default ChannelsBinding

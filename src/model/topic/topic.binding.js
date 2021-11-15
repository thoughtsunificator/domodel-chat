import { Binding } from "domodel"

import TopicEventListener from "./topic.event.js"

/**
 * @global
 */
class TopicBinding extends Binding {

	/**
	 * @param {object} properties
	 * @param {Chat}   properties.chat
	 * @param {object} properties.channel
	 */
	constructor(properties) {
		super(properties, new TopicEventListener(properties.chat))
	}

	onCreated() {

		const { chat, channel } = this.properties

		this.listen(chat, "channelSet", data => {
			this.identifier.topic.textContent = chat.channel.topic
			this.identifier.topic.title = chat.channel.topic
		})

	}

}

export default TopicBinding

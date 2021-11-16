import { Binding } from "domodel"

import MessagesEventListener from "./messages.event.js"

import MessageModel from "./message/message.js"

import MessageBinding from "./message/message.binding.js"

/**
 * @global
 */
class MessagesBinding extends Binding {

	/**
	 * @param {object} properties
	 * @param {Chat}   properties.chat
	 */
	constructor(properties) {
		super(properties, new MessagesEventListener(properties.chat))
	}

	onCreated() {

		const { chat } = this.properties

		this.listen(chat, "channelSet", (channel) => {
			if (chat.channel.name !== channel.name) {
				return
			}
			this.root.style.gridArea = "2 / 2"
			for (const message of channel.messages) {
				this.run(MessageModel(message), { binding: new MessageBinding({ message }) })
			}
			this.root.scrollTop = this.root.scrollHeight
		})

		this.listen(chat, "networkSet", (channel) => {
			this.root.style.gridArea = "span 2 / 2"
			for (const message of chat.networkMessages) {
				this.run(MessageModel(message), { binding: new MessageBinding({ message }) })
			}
		})

	}

}

export default MessagesBinding

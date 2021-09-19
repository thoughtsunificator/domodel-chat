import { Binding } from "domodel"

import MessageModel from "./message.js"
import MessageBinding from "./message.binding.js"

export default class extends Binding {

	onCreated() {

		const { chat } = this.properties

		this.listen(chat, "chat message", message => { // FIXME naming convention
			chat.emit("message add", {
				message: {
					message,
					time: new Date().getTime(),
					source: "---"
				}
			})
		})

		this.listen(chat, "message add", data => {
			const { message, channel = null } = data
			const replacedMessage = chat.decorateMessage(message.message)
			if (chat.channel === null) {
				chat.messages.push(message)
				this.run(MessageModel({ message, replacedMessage }), { binding: new MessageBinding() })
			} else if(channel !== null) {
				chat.channels.find(ch => ch.name === channel.name).messages.push(message)
				if(chat.channel.name === channel.name) {
					this.run(MessageModel({ message, replacedMessage }), { binding: new MessageBinding() })
				}
			} else {
				chat.channel.messages.push(message)
				this.run(MessageModel({ message, replacedMessage }), { binding: new MessageBinding() })
			}
			this.root.scrollTop = this.root.scrollHeight
		})

		this.listen(chat, "channel set", channel => {
			if (chat.channel.name !== channel.name) {
				return
			}
			this.root.style.gridArea = "2 / 2" // TODO
			this.root.innerHTML = ""
			for (const message of channel.messages) {
				const replacedMessage = chat.decorateMessage(message.message)
				this.run(MessageModel({ message, replacedMessage }), { binding: new MessageBinding() })
			}
		})

		this.listen(chat, "channel left", () => {
			if (chat.channels.length === 0) {
				this.root.style.gridArea = "span 2 / 2" // TODO
				this.root.innerHTML = ""
				for (const message of chat.messages) {
					const replacedMessage = chat.decorateMessage(message.message)
					this.run(MessageModel({ message, replacedMessage }), { binding: new MessageBinding() })
				}
			}
		})

	}

}

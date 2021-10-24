import { Binding } from "domodel"

import ChannelTabModel from "./channel.js"

import ChannelTabBinding from "./channel.binding.js"

export default class extends Binding {

	onCreated() {

		const { chat } = this.properties

		this.listen(chat, "channel add", channel => {
			this.run(ChannelTabModel(channel), { parentNode: this.identifier.list, binding: new ChannelTabBinding({ channel }) })
		})

		this.listen(chat, "channel set", channel => {
			chat.emit("topic show")
		})

		this.listen(chat, "channel left", () => {
			chat.emit("topic hide")
		})

		this.listen(chat, "channel set", channel => {
			if(chat.channel !== null) {
				chat.emit("channel unset", chat.channel)
			}
			this.identifier.network.style.backgroundColor = ""
			chat.channel = channel
			if (channel.disconnected === true) {
				chat.emit("counter clear")
			} else {
				const users = chat.channel.users.map(userId => chat.getUserById(userId))
				chat.emit("users list show")
				for (const user of users) {
					chat.emit("user add", { user, channel: chat.channel })
				}
			}
		})


		this.listen(chat, "channel unset", channel => {
			this.identifier.network.style.backgroundColor = "gray"
		})

		this.listen(chat, "channel left", () => {
			if(chat.channels.length === 0) {
				chat.emit("users list hide")
			}
		})

		this.listen(chat, "channel disconnected", () => {
			chat.emit("counter clear")
		})

		this.identifier.network.addEventListener("click", () => {
			if(chat.channel) {
				chat.emit("channel unset", chat.channel)
				chat.channel = null
			}
		})

	}

}

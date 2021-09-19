import { Binding } from "domodel"

import UserModel from "./user.js"

import UserBinding from "./user.binding.js"

export default class extends Binding {

	onCreated() {

		const { chat } = this.properties

		this.listen(chat, "users list hide", () => {
			this.root.style.display = "none"
		})

		this.listen(chat, "users list show", () => {
			this.root.style.display = "grid"
		})

		this.listen(chat, "counter clear", () => {
			this.identifier.counter.textContent = ""
			this.identifier.counter.title = ""
		})

		this.listen(chat, "counter update", () => {
			this.identifier.counter.textContent = chat.channel.users.length + " total"
			this.identifier.counter.title = chat.channel.users.length + " total"
		})

		this.listen(chat, "user add", data => {
			const { user, channel } = data
			chat.emit("counter update")
			this.run(UserModel({ chat, user, channel }), { parentNode: this.identifier.list, binding: new UserBinding({ user, channel }) })
		})

		this.listen(chat, "user left", () => {
			chat.emit("counter update")
		})

		this.listen(chat, "users list", () => {
			if (chat.channel === null) {
				chat.emit("chat message", "No channel joined. Try /join #<channel>")
			} else {
				chat.emit("chat message", chat.channel.users.map(userId => chat.getUserById(userId).nickname).join(", "))
			}
		})

	}

}

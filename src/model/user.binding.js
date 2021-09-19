import { Binding } from "domodel"

export default class extends Binding {

	onCreated() {

		const { chat, channel, user } = this.properties

		this.listen(chat, "user renamed", data => {
			const { nickname, userId } = data
			if (userId === user.id) {
				this.root.textContent = `${chat.getUserPrefix(user, channel)}${nickname}`
			}
		})

		this.listen(chat, "user left", data => {
			const { userId } = data
			if (data.channel.name === chat.channel.name && userId === user.id) {
				this.remove()
			}
		})

		this.listen(chat, "channel disconnected", () => {
			this.remove()
		})

		this.listen(chat, "channel unset", channel => {
			if(chat.channel.name !== channel.name) {
				return
			}
			this.remove()
		})

		this.root.addEventListener("click", () => {
			chat.emit("input", { value: `/MSG ${user.nickname} `, focus: true})
		})

	}

}

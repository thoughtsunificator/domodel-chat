import { Binding } from "domodel"

export default class extends Binding {

	onCreated() {

		const { chat, channel } = this.properties

		this.listen(chat, "channel set", channel_ => {
			if (channel.name === channel_.name) {
				this.root.style.backgroundColor = "gray"
			} else {
				this.root.style.backgroundColor = ""
			}
		})

		this.listen(chat, "channel left", name => {
			if (name === channel.name) {
				this.remove()
			}
		})

		this.listen(chat, "channel disconnected", name => {
			if (name === channel.name) {
				this.root.textContent = `(${name})`
			}
		})

		this.listen(chat, "channel reconnected", name => {
			if (name === channel.name) {
				this.root.textContent = this.root.textContent.substr(1, this.root.textContent.length - 2)
			}
		})

		this.root.addEventListener("mouseup", event => {
			if(event.button === 0) {
				chat.emit("channel set", channel)
			} else if(event.button === 1) {
				chat.emit("channel leave", channel.name)
			}
		})

	}

}

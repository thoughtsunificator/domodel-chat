import { Binding } from "domodel"

export default class extends Binding {

	onCreated() {

		const { chat, channel } = this.properties

		this.listen(chat, "topic show", () => {
			this.identifier.topic.style.display = "block"
		})

		this.listen(chat, "topic hide", () => {
			this.identifier.topic.style.display = "none"
		})

		this.listen(chat, "topic changed", topic => {
			this.identifier.topic.textContent = topic
			this.identifier.topic.title = topic
		})

		this.listen(chat, "channel set", data => {
			this.identifier.topic.textContent = chat.channel.topic
			this.identifier.topic.title = chat.channel.topic
		})

	}

}

import { Binding } from "domodel"

/**
 * @global
 */
class ChannelBinding extends Binding {

	/**
	 * @param {object}  properties
	 * @param {Chat}    properties.chat
	 * @param {object}  properties.channel
	 */
	constructor(properties) {
		super(properties)
	}

	onCreated() {

		const { chat, channel } = this.properties

		this.listen(chat, "channelSet", (channel_) => {
			if (channel.name === channel_.name) {
				this.root.style.backgroundColor = "gray"
			} else {
				this.root.style.backgroundColor = ""
			}
		})

		this.listen(chat, "channelUnset", (channel_) => {
			if (channel.name === channel_.name) {
				this.root.style.backgroundColor = ""
			}
		})

		this.listen(chat, "channelLeft", (name) => {
			if (name === channel.name) {
				this.remove()
			}
		})

		this.listen(chat, "channelDisconnected", (channel_) => {
			if (channel_.name === channel.name) {
				this.root.textContent = `(${channel_.name})`
			}
		})

		this.listen(chat, "channelReconnected", (channel_) => {
			if (channel_.name === channel.name) {
				this.root.textContent = this.root.textContent.substr(1, this.root.textContent.length - 2)
			}
		})

		this.root.addEventListener("mouseup", event => {
			if(event.button === 0) {
				chat.emit("channelSet", channel)
			} else if(event.button === 1) {
				chat.emit("channelLeave", channel.name)
			}
		})

	}

}

export default ChannelBinding

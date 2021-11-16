import { Binding } from "domodel"

/**
 * @global
 */
class UserBinding extends Binding {

	/**
	 * @param {object} properties
	 * @param {Chat}   properties.chat
	 */
	constructor(properties) {
		super(properties)
	}

	onCreated() {

		const { chat, channel, user } = this.properties

		this.listen(chat, "userRenamed", data => {
			if(data.socketId === user.socketId) {
				this.root.textContent = `${chat.getUserPrefix(user, channel)}${data.nickname}`
			}
		})

		this.listen(chat, "channelUserLeft", data => {
			if(data.channelName === chat.channel.name && data.socketId === user.socketId) {
				this.remove()
			}
		})

		this.listen(chat, "channelDisconnected", () => {
			this.remove()
		})

		this.listen(chat, "channelUnset", channel => {
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

export default UserBinding

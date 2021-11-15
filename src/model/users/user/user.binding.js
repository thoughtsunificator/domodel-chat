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
			const { nickname, socketId } = data
			if (socketId === user.socketId) {
				this.root.textContent = `${chat.getUserPrefix(user, channel)}${nickname}`
			}
		})

		this.listen(chat, "channelUserLeft", data => {
			const { socketId } = data
			if (data.channel.name === chat.channel.name && socketId === user.socketId) {
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

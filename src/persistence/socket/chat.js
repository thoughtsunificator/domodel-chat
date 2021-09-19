import { SOCKET_STATE_CONNECTED, SOCKET_STATE_DISCONNECTED } from "../../object/chat.js"

export default (properties) => {

	const { chat, socket } = properties

	chat.listen("disconnect", () => socket.disconnect())

	chat.listen("connect", () => socket.connect())

	socket.on("connect", () => {
		chat.emit("chat message", "Connected.")
		chat.user.id = socket.id
		chat.emit("input focus")
		if(chat.socketState === SOCKET_STATE_DISCONNECTED) {
			socket.emit("user nickname", chat.user.nickname)
			for (const channel of chat.channels) {
				socket.emit("channel reconnect", channel.name)
			}
		}
		chat.socketState = SOCKET_STATE_CONNECTED
	})

	socket.on("disconnect", () => {
		chat.users = []
		chat.emit("chat message", "Disconnected.")
		chat.channel = null
		chat.socketState = SOCKET_STATE_DISCONNECTED
		for (const channel of chat.channels) {
			channel.disconnected = true
			chat.emit("channel disconnected", channel.name)
		}
	})

}

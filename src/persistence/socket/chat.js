import Chat from "../../object/chat.js"
import { Chat as ChatServer } from "@domodel-chat/server"

export default (properties) => {

	const { chat, socket } = properties

	socket.on("connect", () => {
		chat.emit("messagePrint", "Connected.")
		chat.user.socketId = socket.id
		chat.emit("inputFocus")
		if(!chat.socket.connected) {
			socket.emit(ChatServer.EVENT.USER_NICKNAME_SET, chat.user.nickname)
			for (const channel of chat.channels) {
				socket.emit(ChatServer.EVENT.CHANNEL_RECONNECT, channel.name)
			}
		}
	})

	socket.on("disconnect", () => {
		chat.emit("messagePrint", "Disconnected.")
		chat.channel = null
		for (const channel of chat.channels) {
			channel.disconnected = true
			chat.emit("channelDisconnected", channel)
		}
	})

}

import Chat from "../../object/chat.js"
import { Chat as ChatServer } from "@domodel-chat/server"

export default (properties) => {

	const { chat, socket } = properties

	socket.on("connect", () => {
		chat.emit("messagePrint", { type: Chat.MESSAGE_TYPE.GLOBAL, content: "Connected." })
		chat.user.socketId = socket.id
		chat.emit("inputFocus")
		if(chat.channels.find(channel => channel.disconnected)) {
			for (const channel of chat.channels) {
				socket.emit(ChatServer.EVENT.CHANNEL_RECONNECT, channel.name)
			}
		}
	})

	socket.on("disconnect", () => {
		chat.emit("messagePrint", { type: Chat.MESSAGE_TYPE.GLOBAL, content: "Disconnected." })
		for (const channel of chat.channels) {
			channel.disconnected = true
			chat.emit("channelDisconnected", channel)
		}
	})

}

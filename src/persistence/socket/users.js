import Chat from "../../object/chat.js"
import { Chat as ChatServer } from "@domodel-chat/server"

export default (properties) => {

	const { chat, socket } = properties

	socket.on(ChatServer.EVENT.USER_RENAMED, data => {
		const { nickname, socketId } = data
		chat.emit("userRenamed", { nickname, socketId })
	})

}

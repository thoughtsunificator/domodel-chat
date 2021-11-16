import Chat from "../../object/chat.js"
import { Chat as ChatServer } from "@domodel-chat/server"

export default (properties) => {

	const { chat, socket } = properties

	socket.on(ChatServer.EVENT.USER_RENAME, nickname => {
		chat.user.nickname = nickname
		chat.emit("nicknameChanged", nickname)
	})

}

import Chat from "../../object/chat.js"
import { Chat as ChatServer } from "@domodel-chat/server"

export default (properties) => {

	const { chat, socket } = properties

	socket.on(ChatServer.EVENT.CHANNEL_MESSAGE, message => chat.emit("messageAdd", message))

	socket.on(ChatServer.EVENT.NETWORK_MESSAGE, message => chat.emit("messageAdd", message))

}

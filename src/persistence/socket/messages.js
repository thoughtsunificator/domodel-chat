import Chat from "../../object/chat.js"
import { Chat as ChatServer } from "@domodel-chat/server"

export default (properties) => {

	const { chat, socket } = properties

	socket.on(ChatServer.EVENT.GLOBAL_MESSAGE, data => chat.emit("messageAdd", { type: Chat.MESSAGE_TYPE.GLOBAL, ...data }))

	socket.on(ChatServer.EVENT.NETWORK_MESSAGE, data => chat.emit("messageAdd", { type: Chat.MESSAGE_TYPE.NETWORK, ...data }))

	socket.on(ChatServer.EVENT.CHANNEL_MESSAGE, data => chat.emit("messageAdd", { type: Chat.MESSAGE_TYPE.CHANNEL, ...data }))

	socket.on(ChatServer.EVENT.CHANNEL_PRIVATE_MESSAGE, data => chat.emit("messageAdd", { type: Chat.MESSAGE_TYPE.PRIVATE, ...data }))


}

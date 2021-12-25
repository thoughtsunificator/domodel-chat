import Channels from "./socket/channels.js"
import Input from "./socket/input.js"
import Chat from "./socket/chat.js"
import Messages from "./socket/messages.js"
import Users from "./socket/users.js"

export default async properties => {

	const { chat } = properties

	const socket = io.connect(window.SOCKET_URL, { ...window.SOCKET_OPTIONS, transports : ['websocket'] })

	chat.socket = socket

	socket.on("connect_error", (err) => {
		console.log(`connect_error due to ${err.message}`, err);
	});

	const properties_ = { ...properties, socket }

	Chat(properties_)
	Channels(properties_)
	Messages(properties_)
	Users(properties_)
	Input(properties_)

}

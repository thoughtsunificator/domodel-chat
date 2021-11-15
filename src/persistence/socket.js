import Channels from "./socket/channels.js"
import Input from "./socket/input.js"
import Chat from "./socket/chat.js"
import Messages from "./socket/messages.js"
import Users from "./socket/users.js"

import config from ":config"

export default async properties => {

	const { chat } = properties

	const socket = io.connect(config.SOCKET_URL, { ...config.SOCKET_OPTIONS, transports : ['websocket'] })

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

import Channels from "./socket/channels.js"
import Input from "./socket/input.js"
import Chat from "./socket/chat.js"
import Messages from "./socket/messages.js"
import Users from "./socket/users.js"

import Config from "data/config.js"

export default async properties => {

	const { chat } = properties

	const socket = io.connect(Config.SOCKET_URL, { ...Config.SOCKET_OPTIONS, transports : ['websocket'] })

	socket.on("connect_error", (err) => {
		console.log(`connect_error due to ${err.message}`, err);
	});

	Chat({ chat, socket })
	Channels({ chat, socket })
	Messages({ chat, socket })
	Users({ chat, socket })
	Input({ chat, socket })

}

export default (properties) => {

	const { chat, socket } = properties

	chat.listen("channel list", query => socket.emit("channel list", query))

	chat.listen("channel topic", topic => socket.emit("channel topic", { topic, name: chat.channel.name }))

	chat.listen("channel join", name => {
		const channel = chat.channels.find(item => item.name === name)
		if (typeof channel === "undefined") {
			socket.emit("channel join", name)
		} else if(channel.disconnected === true) {
			socket.emit("channel reconnect", name)
		} else {
			chat.emit("channel set", channel)
		}
	})

	chat.listen("channel leave", name => {
		if(chat.channel.disconnected === true) {
			const index = chat.channels.findIndex(channel => channel.name === name)
			chat.channels.splice(index, 1)
			chat.emit("channel left", name)
			if (chat.channels.length >= 1) {
				chat.channel = chat.channels[0]
				chat.emit("channel set", chat.channels[0])
			} else {
				chat.channel = null
			}
		} else if(chat.channel === null) {
			chat.emit("chat message", "No channel joined. Try /join #<channel>")
		} else {
			socket.emit("channel leave", name)
		}
	})

	chat.listen("channel disconnect", (name = chat.channel.name) => socket.emit("channel disconnect", name))

	chat.listen("channel delete", name => socket.emit("channel delete", name))

	socket.on("channel list", channels => chat.emit("chat message", channels.map(channel => channel.name).join(" ")))

	socket.on("channel topic", data => chat.emit("topic changed", data.topic))

	socket.on("channel join", data => {
		const { channel, users, nickname} = data
		chat.user.nickname = nickname
		chat.users = users
		chat.channel = channel
		chat.channels.push(chat.channel)
		chat.emit("channel add", channel)
		chat.emit("channel set", channel)
	})

	socket.on("channel reconnect", data => {
		const { channel, users, nickname } = data
		chat.user.nickname = nickname
		chat.users = users
		const channel_ = chat.channels.find(channel_ => channel_.name === channel.name)
		channel_.users = channel.users
		channel_.owner = channel.owner
		channel_.topic = channel.topic
		channel_.messages = channel.messages
		channel_.disconnected = false
		chat.emit("channel reconnected", channel_.name)
		chat.emit("channel set", channel_)
	})

	socket.on("channel leave", channel_ => {
		const index = chat.channels.findIndex(channel => channel.name === channel_.name)
		chat.channels.splice(index, 1)
		chat.emit("channel left", channel_.name)
		if (chat.channels.length >= 1) {
			chat.channel = chat.channels[0]
			chat.emit("channel set", chat.channels[0])
		} else {
			chat.channel = null
		}
	})

	socket.on("channel disconnect", channel_ => {
		chat.channel = null
		const channel = chat.channels.find(channel => channel.name === channel_.name)
		channel.disconnected = true
		chat.emit("channel disconnected", channel_.name)
	})

}

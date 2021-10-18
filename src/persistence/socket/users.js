export default (properties) => {

	const { chat, socket } = properties

	socket.on("user joined", data => {
		const { users, channel } = data
		const index = chat.channels.findIndex(channel_ => channel_.name === channel.name)
		chat.users = users
		chat.channels[index].users = channel.users
		if(chat.channel.name === channel.name) {
			chat.emit("user add", data)
		}
	})

	socket.on("user left", data => {
		const { channel, users } = data
		const index = chat.channels.findIndex(channel_ => channel_.name === channel.name)
		chat.users = users
		chat.channels[index].users = channel.users
		if (chat.channel.name === channel.name) {
			chat.emit("user left", data)
		}
	})

	socket.on("user renamed", data => {
		const { nickname, userId, users } = data
		chat.users = users
		chat.emit("user renamed", { nickname, userId })
	})

}

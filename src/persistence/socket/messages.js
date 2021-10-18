export default (properties) => {

	const { chat, socket } = properties

	chat.listen("user message", data => {
		const { nickname, message } = data
		if (chat.channel === null) {
			chat.emit("chat message", "No channel joined. Try /join #<channel>")
		} else {
			socket.emit("user message", {nickname, message, channelName: chat.channel.name})
		}
	})

	chat.listen("message send", message => socket.emit("message send", { channelName: chat.channel.name, message}))

	socket.on("message send", message => chat.emit("message add", message))

}

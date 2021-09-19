export default (properties) => {

	const { chat, socket } = properties

	chat.listen("nickname set", nickname => {
		socket.emit("nickname set", nickname)
	})

	socket.on("nickname set", nickname => {
		chat.user.nickname = nickname
		chat.emit("nickname changed", nickname)
	})

}

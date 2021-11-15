import Chat from "../../object/chat.js"
import { Chat as ChatServer } from "@domodel-chat/server"

export default (properties) => {

	const { chat, socket } = properties

	socket.on(ChatServer.EVENT.CHANNEL_LIST, channels => {
		if(channels.length >= 1) {
			chat.emit("messagePrint", channels.map(channel => channel.name).join(" "))
		} else {
			chat.emit("messagePrint", "No channels were found. Try creating one: /join #<channel>")
		}
	})

	socket.on(ChatServer.EVENT.CHANNEL_TOPIC, data => chat.emit("topicChanged", data.topic))

	socket.on(ChatServer.EVENT.CHANNEL_JOIN, data => {
		const { channel, nickname } = data
		chat.user.nickname = nickname
		chat.emit("channelAdd", channel)
		chat.emit("channelSet", channel)
	})

	socket.on(ChatServer.EVENT.CHANNEL_RECONNECT, data => {
		chat.user.nickname = nickname
		const channel = chat.channels.find(channel => channel.name === data.channel.name)
		console.log(channel)
		channel.users = data.channel.users
		channel.owner = data.channel.owner
		channel.topic = data.channel.topic
		channel.disconnected = false
		chat.emit("channelReconnected", channel)
		chat.emit("channelSet", channel)
	})

	socket.on(ChatServer.EVENT.CHANNEL_USER_JOINED, data => {
		const index = chat.channels.findIndex(channel => channel.name === data.channel.name)
		chat.channels[index].users = data.channel.users
		if(chat.channel.name === data.channel.name) {
			chat.emit("userAdd", data)
		}
	})

	socket.on(ChatServer.EVENT.CHANNEL_USER_LEFT, data => {
		const index = chat.channels.findIndex(channel => channel.name === data.channel.name)
		chat.channels[index].users = data.channel.users
		if (chat.channel.name === data.channel.name) {
			chat.emit("channelUserLeft", data)
		}
	})

	socket.on(ChatServer.EVENT.CHANNEL_LEAVE, name => {
		const index = chat.channels.findIndex(channel => channel.name === name)
		chat.channels.splice(index, 1)
		chat.emit("channelLeft", name)
		if (chat.channels.length >= 1) {
			chat.emit("channelSet", chat.channels[0])
		} else {
			chat.channel = null
		}
	})

	socket.on(ChatServer.EVENT.CHANNEL_DISCONNECT, name => {
		const channel = chat.channels.find(channel => channel.name === name)
		chat.emit("channelDisconnected", channel)
	})

}

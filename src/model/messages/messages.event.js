import { EventListener } from "domodel"
import { Chat as ChatServer } from "@domodel-chat/server"

import MessageModel from "./message/message.js"

import MessageBinding from "./message/message.binding.js"

/**
 * @global
 */
class MessagesEventListener extends EventListener {

	/**
	 * @event MessagesEventListener#messageUser
	 * @property {object} data
	 * @property {Chat}   data.chat
	 */
	messageUser(data) {
		const { chat } = this.properties
		const { nickname, content } = data
		if (chat.channel === null) {
			chat.emit("messagePrint", "No channel joined. Try /join #<channel>")
		} else {
			if(content.length > ChatServer.MAXIMUM_MESSAGE_LENGTH) {
				chat.emit("messagePrint", `Message cannot exceed ${ChatServer.MAXIMUM_MESSAGE_LENGTH} characters.`)
			} else {
				chat.socket.emit(ChatServer.EVENT.CHANNEL_MESSAGE_USER, { nickname, content, channelName: chat.channel.name })
			}
		}
	}

	/**
	 * @event MessagesEventListener#messagePrint
	 * @property {string} content
	 */
	messagePrint(content) {
		const { chat } = this.properties
		chat.emit("messageAdd", {
			message: {
				content,
				date: new Date(),
				source: "---"
			}
		})
	}

	/**
	 * @event MessagesEventListener#messageAdd
	 * @property {object} data
	 * @property {object} data.message
	 * @property {object} data.channel
	 */
	messageAdd(data) {
		const { chat } = this.properties
		const { message, channel = null } = data
		if(chat.channel !== null && chat.channel === channel) {
			chat.channel.messages.push(message)
			this.run(MessageModel(message), { binding: new MessageBinding({ message }) })
		} else if(channel !== null) {
			chat.channels.find(ch => ch.name === channel.name).messages.push(message)
		} else {
			chat.networkMessages.push(message)
			this.run(MessageModel(message), { binding: new MessageBinding({ message }) })
		}
		this.root.scrollTop = this.root.scrollHeight
	}

}

export default MessagesEventListener

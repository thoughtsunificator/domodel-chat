import { EventListener } from "domodel"
import Chat from "/object/chat.js"
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
			chat.emit("messagePrint", { type: Chat.MESSAGE_TYPE.NETWORK, content:"No channel joined. Try /join #<channel>" })
		} else {
			if(content.length > ChatServer.MAXIMUM_MESSAGE_LENGTH) {
				chat.emit("messagePrint", { type: Chat.MESSAGE_TYPE.NETWORK, content:`Message cannot exceed ${ChatServer.MAXIMUM_MESSAGE_LENGTH} characters.` })
			} else {
				chat.socket.emit(ChatServer.EVENT.CHANNEL_MESSAGE_USER, { nickname, content, channelName: chat.channel.name })
			}
		}
	}

	/**
	 * @event MessagesEventListener#messagePrint
	 * @property {object} data
	 * @property {object} data.type
	 * @property {object} data.content
	 */
	messagePrint(data) {
		const { chat } = this.properties
		chat.emit("messageAdd", {
			type: data.type,
			message: {
				content: data.content,
				date: new Date(),
				source: "---"
			}
		})
	}

	/**
	 * @event MessagesEventListener#messageAdd
	 * @property {object} data
	 * @property {string} data.type
	 * @property {object} data.message
	 * @property {string} data.message.source
	 * @property {string} data.message.date
	 * @property {string} data.message.content
	 * @property {string} data.channelName
	 */
	messageAdd(data) {
		const { chat } = this.properties
		const { type, message, channelName } = data
		if((type === Chat.MESSAGE_TYPE.CHANNEL || type === Chat.MESSAGE_TYPE.PRIVATE)) {
			if(chat.channel !== null && chat.channel.name === channelName) {
				chat.channel.messages.push(message)
				this.run(MessageModel(message), { binding: new MessageBinding({ message }) })
			} else {
				chat.channels.find(channel => channel.name === channelName).messages.push(message)
			}
		} else if(type === Chat.MESSAGE_TYPE.NETWORK) {
			chat.networkMessages.push(message)
			if(chat.channel === null) {
				this.run(MessageModel(message), { binding: new MessageBinding({ message }) })
			}
		} else if(type === Chat.MESSAGE_TYPE.GLOBAL) {
			chat.networkMessages.push(message)
			chat.channels.forEach(channel => channel.messages.push(message))
			this.run(MessageModel(message), { binding: new MessageBinding({ message }) })
		}
		this.root.scrollTop = this.root.scrollHeight
	}

}

export default MessagesEventListener

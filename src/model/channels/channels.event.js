import { EventListener } from "domodel"
import { Chat as ChatServer } from "@domodel-chat/server"

import ChannelTabModel from "./channel/channel.js"

import ChannelTabBinding from "./channel/channel.binding.js"

/**
 * @global
 */
class ChannelsEventListener extends EventListener {

	/**
	 * @event ChannelsEventListener#channelUserLeft
	 * @property {object} data
	 * @property {object} data.channel
	 * @property {number} data.socketId
	 */

	/**
	 * @event ChannelsEventListener#channelAdd
	 * @property {object} channel
	 */
	channelAdd(channel) {
		const { chat } = this.properties
		chat.channels.push(channel)
		this.run(ChannelTabModel(channel), { parentNode: this.identifier.list, binding: new ChannelTabBinding({ channel }) })
	}

	/**
	 * @event ChannelsEventListener#channelSet
	 * @property {object} channel
	 */
	channelSet(channel) {
		const { chat } = this.properties
		if(chat.channel !== null) {
			chat.emit("channelUnset", chat.channel)
		}
		chat.channel = channel
		chat.emit("topicShow")
		this.identifier.network.style.backgroundColor = ""
		chat.channel = channel
		if (channel.disconnected === true) {
			chat.emit("userCounterClear")
		} else {
			chat.emit("usersListShow")
			for (const user of chat.channel.users) {
				chat.emit("userAdd", { user, channel: chat.channel })
			}
		}
	}

	/**
	 * @event ChannelsEventListener#channelUnset
	 * @property {object} channel
	 */
	channelUnset(channel) {
		chat.channel = null
		this.identifier.network.style.backgroundColor = "gray"
	}

	/**
	 * @event ChannelsEventListener#channelLeft
	 */
	channelLeft() {
		const { chat } = this.properties
		if(chat.channels.length === 0) {
			this.identifier.network.style.backgroundColor = "gray"
			chat.emit("networkSet")
		}
	}

	/**
	 * @event ChannelsEventListener#channelList
	 * @property {string} query
	 */
	channelList(query) {
		chat.socket.emit(ChatServer.EVENT.CHANNEL_LIST, query)
	}

	/**
	 * @event ChannelsEventListener#channelTopic
	 * @property {string} topic
	 */
	channelTopic(topic) {
		const { chat } = this.properties
		if(chat.channel === null) {
			chat.emit("messagePrint", { type: Chat.MESSAGE_TYPE.NETWORK, content: "No channel joined. Try /join #<channel>" })
		} else if(topic.length > ChatServer.MAXIMUM_TOPIC_LENGTH) {
			chat.emit("messagePrint", { type: Chat.MESSAGE_TYPE.NETWORK, content: `Topic cannot exceed ${ChatServer.MAXIMUM_TOPIC_LENGTH} characters.` })
		} else {
			chat.socket.emit(ChatServer.EVENT.CHANNEL_TOPIC, { topic, name: chat.channel.name })
		}
	}

	/**
	 * @event ChannelsEventListener#channelJoin
	 * @property {string} name
	 */
	channelJoin(name) {
		const { chat } = this.properties
		const channel = chat.channels.find(item => item.name === name)
		if (typeof channel === "undefined") {
			chat.socket.emit(ChatServer.EVENT.CHANNEL_JOIN, name)
		} else if(channel.disconnected === true) {
			chat.socket.emit(ChatServer.EVENT.CHANNEL_RECONNECT, name)
		} else {
			chat.emit("channelSet", channel)
		}
	}

	/**
	 * @event ChannelsEventListener#channelLeave
	 * @property {string} name
	 */
	channelLeave(name) {
		const { chat } = this.properties
		if(chat.channel.disconnected === true) {
			const index = chat.channels.findIndex(channel => channel.name === name)
			chat.channels.splice(index, 1)
			chat.emit("channelLeft", name)
			if (chat.channels.length >= 1) {
				chat.channel = chat.channels[0]
				chat.emit("channelSet", chat.channels[0])
			} else {
				chat.channel = null
			}
		} else if(chat.channel === null) {
			chat.emit("messagePrint", { type: Chat.MESSAGE_TYPE.NETWORK, content: "No channel joined. Try /join #<channel>" })
		} else {
			chat.socket.emit(ChatServer.EVENT.CHANNEL_LEAVE, name)
		}
	}

	/**
	 * @event ChannelsEventListener#channelDisconnect
	 * @property {string} [name=chat.channel.name]
	 */
	channelDisconnect(name = chat.channel.name) {
		const { chat } = this.properties
		chat.socket.emit(ChatServer.EVENT.CHANNEL_DISCONNECT, name)
	}

	/**
	 * @event ChannelsEventListener#channelAdd
	 * @property {object} channel
	 */
	channelDisconnected(channel) {
		const { chat } = this.properties
		channel.disconnected = true
		chat.emit("userCounterClear")
	}

	/**
	 * @event ChannelsEventListener#channelDelete
	 * @property {string} name
	 */
	channelDelete(name) {
		const { chat } = this.properties
		chat.socket.emit(ChatServer.EVENT.CHANNEL_DELETE, name)
	}

}

export default ChannelsEventListener

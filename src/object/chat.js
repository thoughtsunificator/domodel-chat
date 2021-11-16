import { Observable } from "domodel"
import { Chat as ChatServer } from "@domodel-chat/server"

/**
 * @global
 */
class Chat extends Observable {

	static MESSAGE_TYPE = {
		GLOBAL: "GLOBAL",
		NETWORK: "NETWORK",
		CHANNEL: "CHANNEL",
		PRIVATE: "PRIVATE",
	}

	constructor() {
		super()
		this._user = { nickname: ChatServer.DEFAULT_NICKNAME }
		this._users = [ this.user ]
		this._channels = []
		this._channel = null
		this._socket = null
		this._networkMessages = []
	}

	/**
	 * @param {object} user
	 * @param {object} channel
	 */
	getUserPrefix(user, channel) {
		if (user.socketId === channel.owner) {
			return ChatServer.PREFIX_OWNER
		}
		return ""
	}

	/**
	 * @param {string} name
	 */
	removeChannel(name) {
		const index = this.channels.findIndex(channel => channel.name === name)
		this.channels.splice(index, 1)
	}

	/**
	 * @type {object}
	 */
	get user() {
		return this._user
	}

	set user(user) {
		this._user = user
	}

	/**
	 * @type {array}
	 */
	get users() {
		return this._users
	}

	set users(users) {
		this._users = users
	}

	/**
	 * @type {array}
	 */
	get channels() {
		return this._channels
	}

	set channels(channels) {
		this._channels = channels
	}

	/**
	 * @type {object}
	 */
	get channel() {
		return this._channel
	}

	set channel(channel) {
		this._channel = channel
	}

	/**
	 * @type {array}
	 */
	get networkMessages() {
		return this._networkMessages
	}

	set networkMessages(networkMessages) {
		this._networkMessages = networkMessages
	}

	/**
	 * @type {object}
	 */
	get socket() {
		return this._socket
	}

	set socket(socket) {
		this._socket = socket
	}

}

export default Chat

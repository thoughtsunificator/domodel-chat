import { Observable } from "domodel"
import { Tokenizer } from "@thoughtsunificator/message-parser"

export const PREFIX_CHANNEL = "#"
export const PREFIX_OWNER = "@"
export const DEFAULT_NICKNAME = "Anon"
export const DEFAULT_TOPIC = "Topic not set. Use /topic to change the topic."

const SOCKET_STATE_INITIAL = "SOCKET_STATE_INITIAL"
export const SOCKET_STATE_CONNECTED = "SOCKET_STATE_CONNECTED"
export const SOCKET_STATE_DISCONNECTED = "SOCKET_STATE_DISCONNECTED"

export default class extends Observable {

	constructor() {
		super()
		this._user = { nickname: DEFAULT_NICKNAME }
		this._users = [this.user]
		this._channels = []
		this._channel = null
		this._messages = []
		this._socketState = SOCKET_STATE_INITIAL
	}

	getUserPrefix(user, channel) {
		if (user.id === channel.owner) {
			return PREFIX_OWNER
		}
		return ""
	}

	getUserById(id) {
		return this.users.find(user => user.id === id)
	}

	removeChannel(name) {
		const index = this.channels.findIndex(channel => channel.name === name)
		this.channels.splice(index, 1)
	}

	decorateMessage(text) {
		const tokens = Tokenizer.tokenize(text)
		const message = {
			tagName: "span",
			children: []
		}
		for (const [index, token] of tokens.entries()) {
			if(token.type === "CHANNEL") {
				message.children.push({
					tagName: "a",
					href: "javascript:;",
					onclick: () => this.emit("channel join", token.buffer),
					textContent: token.buffer
				})
			} else if(token.type === "USER") {
				message.children.push({
					tagName: "a",
					href: "javascript:;",
					onclick: () => this.emit("input", { value: `/MSG ${token.buffer.substring(1)} `, focus: true}),
					textContent: token.buffer
				})
			} else {
				message.children.push({
					tagName: "span",
					textContent: token.buffer
				})
			}
		}
		return message
	}

	get user() {
		return this._user
	}

	set user(user) {
		this._user = user
	}

	get users() {
		return this._users
	}

	set users(users) {
		this._users = users
	}

	get channels() {
		return this._channels
	}

	set channels(channels) {
		this._channels = channels
	}

	get channel() {
		return this._channel
	}

	set channel(channel) {
		this._channel = channel
	}

	get messages() {
	 return this._messages
	}

	set messages(messages) {
		this._messages = messages
	}

	get socketState() {
		return this._socketState
	}

	set socketState(socketState) {
		this._socketState = socketState
	}

}

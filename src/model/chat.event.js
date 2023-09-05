import { EventListener } from "domodel"

import Commands from "../data/commands.js"
import Chat from "../object/chat.js"

/**
 * @global
 */
class ChatEventListener extends EventListener {

	/**
	 * @event ChatEventListener#disconnect
	 */
	disconnect() {
		const { chat } = this.properties
		chat.socket.disconnect()
	}

	/**
	 * @event ChatEventListener#connect
	 */
	connect() {
		const { chat } = this.properties
		chat.socket.connect()
	}

	/**
	 * @event ChatEventListener#networkSet
	 */
	networkSet() {
		const { chat } = this.properties
		this.root.classList.remove("room")
		if(chat.channel !== null) {
			chat.emit("channelUnset", chat.channel)
			chat.emit("usersListHide")
			chat.emit("topicHide")
		}
	}

	/**
	 * @event ChatEventListener#help
	 */
	help() {
		const { chat } = this.properties
		chat.emit("messagePrint", { type: Chat.MESSAGE_TYPE.NETWORK, content: `\nList of commands:\n${Commands.map(command => command.syntax).join("\n")}` })
	}

	/**
	 * @event ChatEventListener#logDebug
	 */
	logDebug () {
		const { chat } = this.properties
		console.log(chat)
	}

}

export default ChatEventListener

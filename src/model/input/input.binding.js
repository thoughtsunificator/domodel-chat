import { Binding } from "domodel"
import { Processor } from "@thoughtsunificator/command-processor"
import { Chat as ChatServer } from "@domodel-chat/server"

import InputEventListener from "./input.event.js"

import Chat from "/object/chat.js"

/**
 * @global
 */
class InputBinding extends Binding {

	/**
	 * @param {object} properties
	 * @param {Chat}   properties.chat
	 */
	constructor(properties) {
		super(properties, new InputEventListener(properties.chat))
	}

	onCreated() {

		const { chat, commands } = this.properties

		const _history = []
		const _commandProcessor = new Processor(commands)
		let _historyIndex = 0

		this.identifier.input.addEventListener("keyup", event => {
			if (event.keyCode === 38 && _historyIndex > 0) {
				_historyIndex--
				this.identifier.input.value = _history[_historyIndex]
			} else if (event.keyCode === 40 && _historyIndex < _history.length - 1) {
				_historyIndex++
				this.identifier.input.value = _history[_historyIndex]
			}
			else if (event.keyCode === 13) {
				const { value } = this.identifier.input
				if (value.length === 0) {
					return
				}
				_history.push(value)
				_historyIndex = _history.length
				this.identifier.input.value = ""
				if (value.substr(0, 1) === Processor.PREFIX_COMMAND) {
					const command = _commandProcessor.run(value)
					if(command.error) {
						chat.emit("messagePrint", { type: Chat.MESSAGE_TYPE.NETWORK, content: command.error })
					} else {
						chat.emit(command.data, command.args)
					}
					_commandProcessor.run(value)
				} else {
					if (!chat.socket.connected) {
						chat.emit("messagePrint", { type: Chat.MESSAGE_TYPE.NETWORK, content: "Your are not connected to the network. Try /connect"  })
					} else if (chat.channel === null) {
						chat.emit("messagePrint", { type: Chat.MESSAGE_TYPE.NETWORK, content: "No channel joined. Try /join #<channel>" })
					} else {
						if(value.length > ChatServer.MAXIMUM_MESSAGE_LENGTH) {
							chat.emit("messagePrint", { type: Chat.MESSAGE_TYPE.NETWORK, content: `Message cannot exceed ${ChatServer.MAXIMUM_MESSAGE_LENGTH} characters.` })
						} else {
							chat.socket.emit(ChatServer.EVENT.CHANNEL_MESSAGE, { channelName: chat.channel.name, message: { source: chat.user.nickname, content: value } })
						}
					}
				}
			}
		})

		this.identifier.buttonNick.addEventListener("click", () => {
			this.identifier.popup.style.display = "grid"
			this.identifier.input_nick.value = chat.user.nickname
			this.identifier.input_nick.focus()
		})

		this.identifier.popup.addEventListener("click", () => {
			if(event.target.contains(this.identifier.popup) === true) {
				this.identifier.popup.style.display = "none"
			}
		})

		this.identifier.input_nick.addEventListener("keypress", (event) => {
			if (event.keyCode === 13) {
				this.identifier.popup.style.display = "none"
				if(chat.socket.connected) {
					chat.emit("userRename", this.identifier.input_nick.value)
				} else {
					chat.emit("messagePrint", { type: Chat.MESSAGE_TYPE.NETWORK, content: "Your are not connected to the network. Try /connect"  })
				}
			}
		})

		this.root.ownerDocument.defaultView.addEventListener("keyup", event => {
			if (event.keyCode === 27) {
				this.identifier.popup.style.display = "none"
			}
		})

		this.root.ownerDocument.defaultView.addEventListener("click", event => {
			if(event.target.contains(this.identifier.emojiButton) === false) {
				this.identifier.submenu.style.display = "none"
			}
		})

		this.identifier.emojiButton.addEventListener("click", () => {
			if(this.identifier.submenu.style.display === "none") {
				this.identifier.submenu.style.display = "grid"
			} else {
				this.identifier.submenu.style.display = "none"
			}
		})

	}

}

export default InputBinding

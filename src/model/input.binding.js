import { Binding } from "domodel"
import { Processor } from "@thoughtsunificator/command-processor"

import { SOCKET_STATE_CONNECTED } from "../object/chat.js"

export default class extends Binding {

	onCreated() {

		const { chat, commands } = this.properties

		const _history = []
		let _historyIndex = 0
		const _commandProcessor = new Processor(commands)

		this.listen(chat, "nickname changed", data => {
			this.identifier.buttonNick.textContent = data
		})

		this.listen(chat, "input", data => {
			const {value, focus, increment} = data
			if(increment === true) {
				this.identifier.input.value += value
			} else {
				this.identifier.input.value = value
			}
			if(focus === true) {
				this.identifier.input.focus()
			}
		})

		this.listen(chat, "input focus", () => {
			this.identifier.input.focus()
		})

		this.identifier.input.addEventListener("keyup", event => {
			if (event.keyCode === 38 && _historyIndex > 0) { // history previous
				_historyIndex--
				this.identifier.input.value = _history[_historyIndex]
			} else if (event.keyCode === 40 && _historyIndex < _history.length - 1) { // history next
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
						chat.emit("chat message", command.error)
					} else {
						chat.emit(command.data, command.args)
					}
					_commandProcessor.run(value)
				} else {
					if (chat.socketState !== SOCKET_STATE_CONNECTED) {
						chat.emit("chat message", "Your are not connected to the network. Try /connect" )
					} else if (chat.channel === null) {
						chat.emit("chat message", "No channel joined. Try /join #<channel>")
					} else {
						chat.emit("message send", { source: chat.user.nickname, message: value })
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
				chat.emit("nickname set", this.identifier.input_nick.value)
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

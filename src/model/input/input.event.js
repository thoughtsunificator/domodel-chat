import { EventListener } from "domodel"
import { Chat as ChatServer } from "@domodel-chat/server"

/**
 * @global
 */
class InputEventListener extends EventListener {

	/**
	 * @event InputEventListener#nicknameChanged
	 * @property {string} nickname
	 */
	nicknameChanged(nickname) {
		this.identifier.buttonNick.textContent = nickname
	}

	/**
	 * @event InputEventListener#input
	 * @property {object}  data
	 * @property {string}  data.value
	 * @property {boolean} data.focus
	 * @property {boolean} data.increment
	 */
	input(data) {
		const { value, focus, increment } = data
		if(increment === true) {
			this.identifier.input.value += value
		} else {
			this.identifier.input.value = value
		}
		if(focus === true) {
			this.identifier.input.focus()
		}
	}

	/**
	 * @event InputEventListener#inputFocus
	 */
	inputFocus() {
		this.identifier.input.focus()
	}

}

export default InputEventListener

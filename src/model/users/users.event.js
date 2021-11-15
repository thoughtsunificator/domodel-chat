import { EventListener } from "domodel"

import UserModel from "./user/user.js"

import UserBinding from "./user/user.binding.js"

/**
 * @global
 */
class UsersEventListener extends EventListener {

	/**
	 * @event UsersEventListener#userRenamed
	 * @property {string} nickname
	 * @property {number} socketId
	 */

	/**
	 * @event UsersEventListener#usersListHide
	 */
	usersListHide() {
		this.root.style.display = "none"
	}

	/**
	 * @event UsersEventListener#usersListShow
	 */
	usersListShow() {
		this.root.style.display = "grid"
	}

	/**
	 * @event UsersEventListener#userCounterClear
	 */
	userCounterClear() {
		this.identifier.counter.textContent = ""
		this.identifier.counter.title = ""
	}

	/**
	 * @event UsersEventListener#userCounterUpdate
	 */
	userCounterUpdate() {
		const { chat } = this.properties
		this.identifier.counter.textContent = chat.channel.users.length + " total"
		this.identifier.counter.title = chat.channel.users.length + " total"
	}

	/**
	 * @event UsersEventListener#userAdd
	 * @property {object} data
	 * @property {object} data.user
	 * @property {object} data.channel
	 */
	userAdd(data) {
		const { chat } = this.properties
		const { user, channel } = data
		chat.emit("userCounterUpdate")
		this.run(UserModel({ chat, user, channel }), { parentNode: this.identifier.list, binding: new UserBinding({ user, channel }) })
	}

	/**
	 * @event UsersEventListener#usersList
	 */
	usersList() {
		const { chat } = this.properties
		if (chat.channel === null) {
			chat.emit("messagePrint", "No channel joined. Try /join #<channel>")
		} else {
			chat.emit("messagePrint", chat.channel.users.map(user => user.nickname).join(", "))
		}
	}

}

export default UsersEventListener

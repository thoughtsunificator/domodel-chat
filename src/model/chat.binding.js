import { Binding } from "domodel"

import ChatEventListener from "./chat.event.js"

import ChannelsModel from "./channels/channels.js"
import TopicModel from "./topic/topic.js"
import UsersModel from "./users/users.js"
import MessagesModel from "./messages/messages.js"
import InputModel from "./input/input.js"

import ChannelsBinding from "./channels/channels.binding.js"
import TopicBinding from "./topic/topic.binding.js"
import UsersBinding from "./users/users.binding.js"
import MessagesBinding from "./messages/messages.binding.js"
import InputBinding from "./input/input.binding.js"


/**
 * @global
 */
class ChatBinding extends Binding {

	/**
	 * @param {object} properties
	 * @param {Chat}   properties.chat
	 */
	constructor(properties) {
		super(properties, new ChatEventListener(properties.chat))
	}

	onCreated() {

		const { chat } = this.properties

		this.run(ChannelsModel, { binding: new ChannelsBinding(this.properties) })
		this.run(TopicModel, { binding: new TopicBinding(this.properties) })
		this.run(MessagesModel, { binding: new MessagesBinding(this.properties) })
		this.run(UsersModel, { binding: new UsersBinding(this.properties) })
		this.run(InputModel(this.properties), { binding: new InputBinding(this.properties) })

		chat.emit("messagePrint", "Connecting...")


	}

}

export default ChatBinding

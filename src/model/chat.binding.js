import { Binding } from "domodel"

import ChannelsModel from "./channels.js"
import TopicModel from "./topic.js"
import UsersModel from "./users.js"
import MessagesModel from "./messages.js"
import InputModel from "./input.js"

import ChannelsBinding from "./channels.binding.js"
import TopicBinding from "./topic.binding.js"
import UsersBinding from "./users.binding.js"
import MessagesBinding from "./messages.binding.js"
import InputBinding from "./input.binding.js"

import Commands from "data/commands.js"

export default class extends Binding {

	onCreated() {

		const { chat } = this.properties

		this.listen(chat, "help", () => {
			chat.emit("chat message", `\nList of commands:\n${Commands.map(command => command.syntax).join("\n")}`)
		})

		this.listen(chat, "log debug", () => console.log(chat))

		this.run(ChannelsModel, { binding: new ChannelsBinding() })
		this.run(TopicModel, { binding: new TopicBinding() })
		this.run(MessagesModel, { binding: new MessagesBinding() })
		this.run(UsersModel, { binding: new UsersBinding() })
		this.run(InputModel(this.properties), { binding: new InputBinding() })

		chat.emit("chat message", "Connecting...")


	}

}

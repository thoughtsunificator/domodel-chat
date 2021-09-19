import "assets/main.css"

import { Core } from "domodel"
import ChatModel from "/model/chat.js"
import ChatBinding from "/model/chat.binding.js"
import Chat from "/object/chat.js"
import Persistence from "/persistence/persistence.js"

import emojis from "data/emojis.js"
import commands from "data/commands.js"

window.addEventListener("load", function() {

	const chat = new Chat()

	Persistence({ chat })

	Core.run(ChatModel, {
		binding: new ChatBinding({ chat, emojis, commands }),
		parentNode: document.body
	})

})

import { Binding } from "domodel"
import { Tokenizer } from "@thoughtsunificator/message-parser"


/**
 * @global
 */
class MessageBinding extends Binding {

	/**
	 * @param {object} properties
	 * @param {Chat}   properties.chat
	 */
	constructor(properties) {
		super(properties)
	}

	onCreated() {

		const { chat, message } = this.properties

		this.listen(chat, "channelSet", (channel) => {
			this.remove()
		})

		this.listen(chat, "networkSet", (channel) => {
			this.remove()
		})

		const tokens = Tokenizer.tokenize(message.content)
		const messageModel = {
			tagName: "span",
			children: []
		}
		for (const [index, token] of tokens.entries()) {
			if(token.type === "CHANNEL") {
				messageModel.children.push({
					tagName: "a",
					href: "javascript:;",
					onclick: () => chat.emit("channelJoin", token.buffer),
					textContent: token.buffer
				})
			} else if(token.type === "USER") {
				messageModel.children.push({
					tagName: "a",
					href: "javascript:;",
					onclick: () => chat.emit("input", { value: `/MSG ${token.buffer.substring(1)} `, focus: true}),
					textContent: token.buffer
				})
			} else {
				const tokenModel = {
					tagName: "span",
					textContent: token.buffer,
				}
				if(message.source === "---") {
					tokenModel.style = `white-space: pre`
				}
				messageModel.children.push(tokenModel)
			}
		}

		this.run(messageModel, { binding: new Binding() })

	}

}

export default MessageBinding

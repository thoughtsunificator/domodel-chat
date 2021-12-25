import { expect } from '@esm-bundle/chai'
import { Chat as ChatServer } from "@domodel-chat/server"
import Chat from "../src/object/chat.js"

describe("Chat", () => {

	it("instance", () => {
		const chat = new Chat()
		expect(Chat.MESSAGE_TYPE.GLOBAL).to.equal("GLOBAL")
		expect(Chat.MESSAGE_TYPE.NETWORK).to.equal("NETWORK")
		expect(Chat.MESSAGE_TYPE.CHANNEL).to.equal("CHANNEL")
		expect(Chat.MESSAGE_TYPE.PRIVATE).to.equal("PRIVATE")
		expect(chat.user).to.deep.equal({ nickname: ChatServer.DEFAULT_NICKNAME })
		expect(chat.users).to.deep.equal([{ nickname: ChatServer.DEFAULT_NICKNAME }])
		expect(chat.channels).to.deep.equal([])
		expect(chat.channel).to.equal(null)
		expect(chat.socket).to.equal(null)
		expect(chat.networkMessages).to.deep.equal([])
	})

})

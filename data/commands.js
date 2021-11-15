import { Command } from "@thoughtsunificator/command-processor"

export default [
	new Command("join <name>", "channelJoin"),
	new Command("nick <nickname>", "userRename"),
	new Command("list <?query>", "channelList"),
	new Command("users", "usersList"),
	new Command("msg <nickname> <content>", "messageUser"),
	new Command("delete <name>", "channelDelete"),
	new Command("topic <topic>", "channelTopic"),
	new Command("part", "channelDisconnect"),
	new Command("help", "help"),
	new Command("disconnect", "disconnect"),
	new Command("connect", "connect"),
	new Command("debug", "logDebug")
]

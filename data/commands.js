import { Command } from "@thoughtsunificator/command-processor"

export default [
	new Command("join <name>", "channel join"),
	new Command("nick <nickname>", "nickname set"),
	new Command("list <?query>", "channel list"),
	new Command("users", "users list"),
	new Command("msg <nickname> <message>", "user message"),
	new Command("delete <name>", "channel delete"),
	new Command("topic <topic>", "channel topic"),
	new Command("part", "channel disconnect"),
	new Command("help", "help"),
	new Command("disconnect", "disconnect"),
	new Command("connect", "connect"),
	new Command("debug", "log debug")
]

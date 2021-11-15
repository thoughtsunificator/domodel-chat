export default (data) => ({
	tagName: "div",
	className: "user",
	textContent: `${data.chat.getUserPrefix(data.user, data.channel)}${data.user.nickname}`
})

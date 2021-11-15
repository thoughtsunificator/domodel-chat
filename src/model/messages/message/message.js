export default message => ({
	tagName: "div",
	className: "message",
	children: [
		{
			tagName: "span",
			textContent:`[${new Date(message.date).toLocaleTimeString('en-US', { hour12: false })}] `
		},
		{
			tagName: "span",
			textContent: `${message.source} `
		}
	]
})

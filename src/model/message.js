export default data => ({
	tagName: "div",
	children: [
		{
			tagName: "span",
			textContent:`[${new Date(data.message.time).toLocaleTimeString('en-US', { hour12: false })}] `
		},
		{
			tagName: "span",
			textContent: `${data.message.source} `
		},
		data.replacedMessage
	]
})

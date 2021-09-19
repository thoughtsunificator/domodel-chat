import { DEFAULT_NICKNAME } from "../object/chat.js"

export default properties => ({
	id: "input",
	tagName: "div",
	children: [
		{
			tagName: "div",
			style: "position: relative; right: 0px; bottom: 0px; cursor: pointer; z-index: 1; text-align: center;",
			children: [
				{
					tagName: "div",
					identifier: "submenu",
					style: "display: none; position: absolute;  padding: 5px; bottom: 35px; grid-template-columns: repeat(10, auto); background-color: rgba(0, 0, 0, 0.28); left: 5px; grid-gap: 5px;",
					children: properties.emojis.map(emoji => ({
							tagName: "div",
							style: "cursor: pointer;",
							onclick: () => properties.chat.emit("input", { value: emoji, increment: true, focus: true}),
							textContent: emoji
						}))
				},
				{
					tagName: "div",
					identifier: "emojiButton",
					style: "cursor: pointer; user-select: none; border-radius: 5px;background-color: #ddd;padding: 0 10px;",
					textContent: "😀"
				}
			]
		},
		{
			tagName: "div",
			id: "nickname",
			children: [
				{
					tagName: "button",
					style: "border: none; background-color: transparent",
					identifier: "buttonNick",
					textContent: `${DEFAULT_NICKNAME}`
				},
				{
					tagName: "div",
					identifier: "popup",
					style: "position:absolute; display: none; place-items:center; height:100%; width:100%; top: 0; left: 0; background-color: #000000b3;",
					children: [
						{
							tagName: "div",
							className: "padding-large",
							style: "background-color: white",
							children: [
								{
									tagName: "label",
									textContent: "Enter new nickname:"
								},
								{
									tagName: "div",
									children: [
										{
											identifier: "input_nick",
											placeholder: "thoughtsuni ficator",
											title: "(3 to 15 chars), alphanumerics and -_",
											tagName: "input"
										}
									]
								},
							]
						}
					]
				}
			]
		},
		{
			autocomplete: "off",
			identifier: "input",
			tagName: "input"
		}
	]
})

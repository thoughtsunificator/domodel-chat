import ENV from ".env.js"

const CONFIG = {
	SOCKET_URL: "ws://localhost:3001",
	SOCKET_OPTIONS: { secure: true }
}

export default {
	...CONFIG,
	...ENV
}

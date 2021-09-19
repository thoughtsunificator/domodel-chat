import fs from "fs"

export default {
	name: 'config',
	resolveId ( source ) {
		if(source === ":config") {
			return source
		}
		return null;
	},
	buildStart(){
		if (fs.existsSync('.env.json')) {
			this.addWatchFile('.env.json')
		}
		if (fs.existsSync('data/config.json')) {
			this.addWatchFile('data/config.json')
		}
	},
	load ( id ) {
		if(id === ":config") {
			let envFile
			if (fs.existsSync('.env.json')) {
				let data = fs.readFileSync('.env.json');
				envFile = JSON.parse(data)
			} else {
				envFile = {}
			}
			let configFile
			if (fs.existsSync('data/config.json')) {
				let data = fs.readFileSync('data/config.json');
				configFile = JSON.parse(data)
			} else {
				configFile = {}
			}
			let config = {}
			for(const key in configFile) {
				if(key in envFile) {
					config[key] = envFile[key]
				} else if(key in process.env) {
					config[key] = process.env[key]
				} else {
					config[key] = configFile[key]
				}
			}
			return `export default ${JSON.stringify(config)}`
		}
		return null;
	}
}

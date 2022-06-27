const { readdirSync, statSync } = require('fs');
const path = require('path');
let { parse , sep , dirname } = require("path")
let glob = require("glob")
const Command = require("./Command")
class CommandHandler {
    constructor(client, {
        directory
    }) {
        this.client = client;
        this.commands = [];
        this.directory = directory;
    }
    isClass(input) {
        return typeof input === 'function' &&
            typeof input.prototype === 'object' &&
            input.toString().substring(0, 5) === 'class';
    }; 
    async init() {
        await this.loadCommands();
        this.client.classLoader.push('[ClassLoader] CommandHandler loaded');
    }
    formatCommands() {
        let formatted = [];
        const categories = readdirSync(this.directory);
        for (const category of categories) {
            let commands = this.getCommands(path.join(this.directory, category).split(/\\/g).join('/'));
            let commandData = [];
            for (const command of commands) {
                let data = require(`${command}`)
                let cmddata = this.client.commands.get(data.name.toLowerCase())
                commandData.push({
                    name: data.name,
                    description: cmddata.description,
                    permissions: cmddata.permissions || [],
                    ownerOnly: cmddata.ownerOnly || false,
                    aliases : cmddata.aliases || []
                })
            }
            formatted.push({ category: category, commands: commandData });
        }
        return formatted;
    }
    getCommands(directory) {
        const results = [];

        (function read(dir) {
            const files = readdirSync(dir);
            for (const file of files) {
                const filepath = path.join(dir, file).split(/\\/g).join('/');
                if (statSync(filepath).isDirectory()) {
                    read(filepath);
                } else {
                    results.push(filepath);
                }
            }
        }(directory));
        return results;
    }

    get dir() {
        return `${process.cwd()}${sep}`
    }
    async loadCommands(command = null) {
        if (command) {
            const  commandName  = glob.sync(`${this.dir}src/commands/${command.category.split(' ').join('-').toLowerCase()}/${command.name.split(' ').join('-').toLowerCase()}.js`.replace(/\\/g, '/'))[0]

            delete require.cache[require.resolve(commandName)];

            const { name } = parse(commandName);
            const  File  = require(commandName);

            if (!File) return new Error(`*${name} is not a file constructor*`);

            const commandFile = new File(this.client, name.toLowerCase());
            commandFile.path = commandName
            this.client.commands.set(commandFile.name, commandFile);
            command.aliases.forEach(alias => {
                this.client.aliases.set(alias, command);
    });
            return commandFile;
        };

        let files = this.getCommands(this.directory);
        for (let commandFile of files) {
            delete require.cache[require.resolve(commandFile)];
            
            const { name } = parse(commandFile);

            const File = require(commandFile);
            if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export a class.`);

            const command = new File(this.client, name.toLowerCase());
            if (!(command instanceof Command)) throw new TypeError(`Command ${name} doesnt belong in Commands.`);

            this.client.commands.set(command.name, command);
            command.path = commandFile
            command.aliases.forEach(alias => {
                this.client.aliases.set(alias, command);
    });
        }
    }
}

module.exports = CommandHandler;
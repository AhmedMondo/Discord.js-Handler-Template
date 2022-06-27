const { readdirSync, statSync } = require('fs');
const path = require('path');
let { parse , sep , dirname } = require("path")
let glob = require("glob")
const Command = require("./SlashCommand")
let { mainGuildID } = require("../configs/config")
const { SlashCommandBuilder } = require('@discordjs/builders');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
class SlashHandler {
    constructor(client, {
        directory
    }) {
        this.client = client;
        this.arrayOfcommands = [];
        this.directory = directory;
    }
    isClass(input) {
        return typeof input === 'function' &&
            typeof input.prototype === 'object' &&
            input.toString().substring(0, 5) === 'class';
    }; 
    async init() {
        await this.loadCommands();
        this.client.classLoader.push('[ClassLoader] SlashHandler loaded');
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
        return `${process.cwd()}${path.sep}`
    }

    formatCommands() {
        let formatted = [];
        const categories = readdirSync(this.directory);
        for (const category of categories) {
            let commands = this.getCommands(path.join(this.directory, category).split(/\\/g).join('/'));
            let commandData = [];
            for (const command of commands) {
                let data = require(`${command}`)
                let cmddata = this.client.slashcommands.get(data.name.toLowerCase())
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
    async loadCommandssss() {
       let commands =  glob.sync(`${process.cwd()}${path.sep}src/slashCommands/**/*.js`.replace(/\\/g, '/'))/* .then(async (commands) => { */

       console.log(commands)
        
            for (const commandFile of commands) {
                delete require.cache[commandFile];
                const { name } = path.parse(commandFile);
                const File = require(commandFile);
                if (!this.isClass(File)) throw new TypeError(`SlashCommand ${name} doesn't export a class.`);
                const command = new File(this.client, name.toLowerCase());
                console.log(command)
                if (!(command instanceof Command)) throw new TypeError(`SlashCommand ${name} doesnt belong in Commands.`);
                this.client.slashcommands.set(command.name, command);
            };
      //-  })
    };


    async loadCommands(command = null) {

        if (command) {
            const  commandName  = glob.sync(`${process.cwd()}${path.sep}src/slashCommands/${command.category.split(' ').join('-').toLowerCase()}/${command.name.split(' ').join('-').toLowerCase()}.js`.replace(/\\/g, '/'))[0]

            delete require.cache[require.resolve(commandName)];

            const { name } = parse(commandName);
            const  File  = require(commandName);

            if (!File) return new Error(`*${name} is not a file constructor*`);

            const commandFile = new File(this.client, name.toLowerCase());
            this.client.slashcommands.set(commandFile.name, commandFile);
            return commandFile;
        };
        try {
       
        let files = this.getCommands(this.directory);
        for (let commandFile of files) {
            delete require.cache[require.resolve(commandFile)];
            
            const { name } = parse(commandFile);

            const File = require(commandFile);
            if (!this.isClass(File)) throw new TypeError(`SlashCommand ${name} doesn't export a class.`);


            const command = new File(this.client, name.toLowerCase());
            if (!(command instanceof Command)) throw new TypeError(`SlashCommand ${name} doesnt belong in Commands.`);
            this.client.slashcommands.set(command.name , command);
         
            
         this.arrayOfcommands.push(command)

        }

   
        

            let slashCommands = this.client.slashcommands;
            let data = [];
    
            for (const [key, value] of slashCommands) {
                data.push({ name: key, description: value.description, options: value?.commandOptions });
            };
    
            await this.client.application.commands.set(data);
                
        } catch (e) {
          console.log(e);
        }
    }



    }


module.exports = SlashHandler;
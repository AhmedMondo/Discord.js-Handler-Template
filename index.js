const config = require("./src/configs/config.js")
const { Client , Collection , Intents } = require("discord.js")
const Util = require('./src/Utils/Utils');
const colors = require("colors");
const CommandHandler = require("./src/Structures/CommandHandler")
const EventHandler = require("./src/Structures/EventHandler")
const SlashHandler = require("./src/Structures/SlashHandler")
const ButtonPaginator = require('./src/Utils/buttonPaginator');
const mongoose = require("./src/DataBase/database")
const Logger = require('./src/Utils/Logger');

class HandlerSystem extends Client {

    constructor(options= {}) {
        super({
            presence : {
                status: 'online',
                activities: [{
                    name: 'New Handler?',
                    type: 'PLAYING'
                }]
            },
            intents: [32767] // All Intents
        });

        this.ownerIds = "583428943378513940" // can be String like "ID" or Array like ["ID1" , "ID2" , "ID3"]
        
        this.optionsLoader(options);
        
        this.commands = new Collection();
        this.slashcommands = new Collection();
        this.events = new Collection();
        this.aliases = new Collection();
        this.cooldowns = new Collection();
        this.defaultCooldown = 3000 // default seconds of cooldown in ms
        this.mongoose = new mongoose(this);
        this.utils = new Util(this);
        this.buttonPaginator = new ButtonPaginator(this)
        this.logger = new Logger(this);
        this.classLoader = [];
        this.clientLoader = [];
        this.chalk = require("chalk")
        // Message Commands Handler
        this.commandHandler = new CommandHandler(this, {
            directory: `${process.cwd()}/src/commands/`,
        });

        //Slash Commands Handler
        this.slashHandler = new SlashHandler(this, {
            directory: `${process.cwd()}/src/slashCommands/`
        });

        //Events Handler
        this.eventHandler = new EventHandler(this, {
            directory: `${process.cwd()}/src/events/`,
        });


    }
    optionsLoader(options) {
        if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

        if (!options.token) throw new Error('You must pass the token for the bot.');
        this.token = options.token;
        if (!options.prefix) throw new Error('You must pass the prefix for the bot.');
        this.prefix = options.prefix;
    };
    async start(token = this.TOKEN) {
        try {

            await this.eventHandler.init();
            await this.buttonPaginator.init();
            await super.login(token);
            await this.mongoose.init();

        } catch (error) {
            console.error(error);
        };
    }
}

const handler = new HandlerSystem(config);
handler.start();
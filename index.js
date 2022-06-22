const config = require("./src/configs/config.js")
const { Client , Collection , Intents } = require("discord.js")
const Util = require('./src/Structures/Utils');
const colors = require("colors");
const CommandHandler = require("./src/Structures/CommandHandler")
const ButtonPaginator = require('./src/Structures/buttonPaginator');
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


        
        this.validate(options);
        this.commands = new Collection();
        this.events = new Collection();
        this.aliases = new Collection();
        this.utils = new Util(this);
        this.buttonPaginator = new ButtonPaginator(this)
        this.classLoader = [];
        this.clientLoader = [];
        this.commandHandler = new CommandHandler(this, {
            directory: `${process.cwd()}/src/commands/`,
        });
        this.ownerIds = "583428943378513940" // can be String like "ID" or Array like ["ID1" , "ID2" , "ID3"]


    }
    validate(options) {
        if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

        if (!options.token) throw new Error('You must pass the token for the bot.');
        this.token = options.token;
        if (!options.prefix) throw new Error('You must pass the prefix for the bot.');
        this.prefix = options.prefix;
    };
    async start(token = this.TOKEN) {
        try {
          // await this.utils.loadCommands();
            await this.utils.loadEvents();
            await this.buttonPaginator.init()
            await super.login(token);
        } catch (error) {
            console.error(error);
        };
    }
}

const handler = new HandlerSystem(config);
handler.start();
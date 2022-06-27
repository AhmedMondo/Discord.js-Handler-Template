const Event = require("../../../Structures/Event")
const Discord = require("discord.js")
class Ready extends Event {
    constructor(...args) {
        super(...args , {
            name: 'ready',
            once: true,
            category: 'Client'
        });
    };

    async EventRun() {

        //Init Handlers
        await this.client.commandHandler.init();
        await this.client.slashHandler.init();
        
        //Logger Area
        try{
             this.client.logger.info(this.client.classLoader)
             this.client.logger.info([
            `[HandlerLoader] ${this.client.events.size} Events loaded`,
            `[HandlerLoader] ${this.client.slashcommands.size} SlashCommands loaded`,
            `[HandlerLoader] ${this.client.commands.size} MessageCommands loaded`
        ])

              this.client.clientLoader.push(...[
                `[Client]          Logged in as ${this.client.user.tag}`,
                `[Guild(s)]        Servers ${this.client.guilds.cache.size} ` ,
                `[Watching]        Members ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} ` ,
                `[Prefix]          ${this.client.prefix}` ,
                `[Discord.js]      v${Discord.version}` ,
                `[Node.js]         ${process.version}` ,
                `[Plattform]       ${process.platform.startsWith("win") ? "Windows" : process.platform} ${process.arch}` ,
                `[Memory]          ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`
              
            ])
            this.client.logger.success(this.client.clientLoader);
        } catch (error) {
            console.error(error);
        };
    }
}

module.exports = Ready;
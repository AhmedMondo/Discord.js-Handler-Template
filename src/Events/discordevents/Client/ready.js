const Event = require("../../../Structures/Event")
const Discord = require("discord.js")
class Ready extends Event {
    constructor(...args) {
        super(...args , {
            name: 'ready',
            once: true,
            type: 'Client',
            category: 'Client'
        });
    };

    async EventRun() {
        await this.client.commandHandler.init();
        try{
            const stringlength = 69;
            console.log("\n")
            console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightGreen)
            console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1+stringlength-` ┃ `.length)+ "┃".bold.brightGreen)
            console.log(`     ┃ `.bold.brightGreen + `Discord Bot is online!`.bold.brightGreen + " ".repeat(-1+stringlength-` ┃ `.length-`Discord Bot is online!`.length)+ "┃".bold.brightGreen)
            console.log(`     ┃ `.bold.brightGreen + ` /--/ ${this.client.user.tag} /--/ `.bold.brightGreen+ " ".repeat(-1+stringlength-` ┃ `.length-` /--/ ${this.client.user.tag} /--/ `.length)+ "┃".bold.brightGreen)
            console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1+stringlength-` ┃ `.length)+ "┃".bold.brightGreen)
            console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightGreen)
          
            console.table({ 
                'Bot User:' : `${this.client.user.tag}` ,
                'Guild(s):' : `${this.client.guilds.cache.size} Servers` ,
                'Watching:' : `${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Members` ,
                'Prefix:' : `${this.client.prefix}` ,
                'Commands:' : `${this.client.commands.size}` ,
                'Events:' : `${this.client.events.size}` ,
                'Discord.js:' : `v${Discord.version}` ,
                'Node.js:' : `${process.version}` ,
                'Plattform:' : `${process.platform} ${process.arch}` ,
                'Memory:' : `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`
              });
        } catch (error) {
            console.error(error);
        };
    }
}

module.exports = Ready;
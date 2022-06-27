const Command = require("../../Structures/Command")
const GuildModel = require("../../DataBase/models/GuildModel");

class Ping extends Command{
    constructor(...args) {
        super(...args , {
            name: 'ping',
            description: 'Calculate Latency',
            category: 'Info',
            aliases: ['latency'],
            usage: '{prefix}ping',
            examples : ['{prefix}ping'],
            ownerOnly: true,
            cooldown: 15000
        });
    };

    async CommandRun(message) {

        try {
            const sent = await message.channel.send('Pinging...')
            let date = Date.now()
            const db = await GuildModel.findOne({guildId: message.guild.id })
              let dbping = Date.now() - date
              let oldate = new Date().getMilliseconds()
              
              const timeDiff = (sent.createdTimestamp) - (message.createdTimestamp);

              let newtime = new Date().getMilliseconds() - oldate;
              if(newtime < 0) newtime *= -1;
              if(newtime > 10) newtime = Math.floor(newtime / 10);
          return sent.edit({ 
            content: `\`\`\`cs
🤖 Bot Ping: ${timeDiff - this.client.ws.ping}
❤️ Database Ping: ${dbping}
⏱️ Api Latency: ${Math.floor(this.client.ws.ping)}
\`\`\``
        });
            
        } catch (error) {
            console.error(error);
            return this.client.utils.error(message, error);
        };
    }
}

module.exports = Ping
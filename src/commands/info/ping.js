const Command = require("../../Structures/Command")

class Ping extends Command{
    constructor(...args) {
        super(...args , {
            name: 'ping',
            description: 'Calculate Latency',
            category: 'Info',
            aliases: ['latency'],
            usage: '%ping',
            examples : ['{prefix}ping' , '{prefix}hi'],
            ownerOnly: true
        });
    };

    async CommandRun(message) {

        try {
          return message.reply({ content: 'Pong'});
            
        } catch (error) {
            console.error(error);
            return this.client.utils.error(message, error);
        };
    }
}

module.exports = Ping
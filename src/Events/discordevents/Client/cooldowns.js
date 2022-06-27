const Event = require("../../../Structures/Event")
const { MessageEmbed , Collection } = require("discord.js")
const ms = require("pretty-ms")
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min) * 1000
  }

class cooldowns extends Event {
    constructor(...args) {
        super(...args , {
            name: 'cooldowns',
            category: 'Client'
        });
    };

    async EventRun(message , command , remaining) {


        const embed = new MessageEmbed()
        .setColor("RED")
        .setDescription(`⚙️ You are on a cooldown for the command: \`${command.name}\`. Please wait: \`${remaining.toFixed(2) / 1000}s\``)

        return message.reply({ content: `**⚙️ You are on a cooldown for the command: \`${command.name}\`. Please wait: \`${ms(remaining , { verbose: true /* , compact: true */ })}\` .**`/* ,embeds: [embed] */ , ephemeral: true }).then(msg => {
            if(message.author) {  // to Check if this is Message Command
                setTimeout(() => {
                    msg.delete()
                }, randomIntFromInterval(0.5, 3)); // random number between 0.5 second and 3 seconds
            } 
        })
        


    }
}

module.exports = cooldowns;
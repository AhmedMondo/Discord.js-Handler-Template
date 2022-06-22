const Event = require("../../../Structures/Event")
const Discord = require("discord.js")
class Message extends Event {
    constructor(...args) {
        super(...args , {
            name: 'messageCreate',
            type: 'Guild',
            category: 'Guild'
        });
    };

    async EventRun(message) {
      if(message.author.bot) return undefined;
      if(message.author.id == this.client.user.id) return undefined;



      

      //Run Command Area -- Danger
      var prefix = this.client.prefix;
      const lowerContent = message.content.toLowerCase();
      const endOfPrefix = lowerContent.indexOf(prefix.toLowerCase()) + prefix.length;
      const startOfArgs = message.content.slice(endOfPrefix).search(/\S/) + prefix.length;
      const args = message.content.slice(startOfArgs).split(/\s{1,}|\n{1,}/)
      const alias = args[0]
      let command = this.client.commands.get(alias) || this.client.aliases.get(alias);
      if(!message.content.startsWith(prefix))  return undefined;
       if(command) {
          
          if(command.ownerOnly) {

           if(Array.isArray(this.client.ownerIds) ? !this.client.ownerIds.includes(message.author.id) : this.client.ownerIds !== message.author.id) {
            return message.reply("This Command can be executed by Owners Only")
          } 
        }
          command.CommandRun(message , args.slice(prefix.length));
      } 
    }
}

module.exports = Message;
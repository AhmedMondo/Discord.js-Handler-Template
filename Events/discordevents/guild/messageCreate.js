const Event = require("../../../Structures/Event")
const Discord = require("discord.js")
const GuildModel = require("../../../DataBase/models/GuildModel")
class Message extends Event {
    constructor(...args) {
        super(...args , {
            name: 'messageCreate',
            category: 'Guild'
        });
    };

    async EventRun(message) {
      if(message.author.bot) return undefined;
      if(message.author.id == this.client.user.id) return undefined;
      var prefix = this.client.prefix;
//console.log("Hi after reload")
let GuildData = await GuildModel.findOne({guildId: message.guild.id})
if(GuildData) {

  prefix = GuildData.prefix
} else {
  await new GuildModel({
    guildId: message.guild.id,
    prefix: this.client.prefix
  }).save()
}
      

      //Run Command Area -- Danger
      
      const lowerContent = message.content.toLowerCase();
      const endOfPrefix = lowerContent.indexOf(prefix.toLowerCase()) + prefix.length;
      const startOfArgs = message.content.slice(endOfPrefix).search(/\S/) + prefix.length;
      const args = message.content.slice(startOfArgs).split(/\s{1,}|\n{1,}/)
      const alias = args[0]
      let command = this.client.commands.get(alias) || this.client.aliases.get(alias);
      if(!message.content.startsWith(prefix))  return undefined;
       if(command) {
          
         if(this.client.utils.runCooldown(message , command)) {

        return  this.client.emit("cooldowns" , message , command , (this.client.utils.runCooldown(message , command)))

         }

         

        //Owner Only area
          if(command.ownerOnly) {

           if(Array.isArray(this.client.ownerIds) ? !this.client.ownerIds.includes(message.author.id) : this.client.ownerIds !== message.author.id) {
            return message.reply("This Command can be executed by Owners Only")
          } 
        }

        //Permissions Area
        if(command.user_permissions?.length && !message.member.permissions.has(command.user_permissions)) {

          return message.reply({
            content: ":x: Sorry you don't have permissions to use this command"
          })
        }
          command.CommandRun(message , args.slice(prefix.length));
      } 
    }
}

module.exports = Message; 
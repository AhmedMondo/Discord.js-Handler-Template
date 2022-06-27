const Event = require('../../../Structures/Event');
const Discord = require("discord.js")
module.exports = class interactionCreate extends Event {
    constructor(...args) {
        super(...args, {
            name: 'interactionCreate',
            categoty: 'Client',

        });
    };

   async EventRun(interaction) {
        if (interaction.isCommand()) {
            const command = this.client.slashcommands.get(interaction.commandName);
            if (command) {
                if(this.client.utils.runCooldown(interaction , command)) {
                   return this.client.emit("cooldowns" , interaction , command , (this.client.utils.runCooldown(interaction , command)))
                    }
                if(command.ownerOnly) {

                    if(Array.isArray(this.client.ownerIds) ? !this.client.ownerIds.includes(interaction.user.id) : this.client.ownerIds !== interaction.user.id) {
                     return interaction.reply({content: "This Command can be executed by Owners Only" , ephemeral : true})
                   } 
                 }
                 if(command.user_permissions?.length && !interaction.member.permissions.has(command.user_permissions)) {

                    return interaction.reply({
                      content: ":x: Sorry you don't have permissions to use this command",
                      ephemeral: true
                    })
                  }
                    return command.InteractionRun(interaction);
                
            };
        };
    };
};
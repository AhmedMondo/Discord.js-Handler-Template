
const Command = require("../../Structures/Command")
const GuildModel = require("../../DataBase/models/GuildModel");
const { Permissions } = require("discord.js");

class SetPrefix extends Command{
    constructor(...args) {
        super(...args , {
            name: 'setprefix',
            description: 'Changing the Prefix',
            category: 'Admin',
            usage: 'newprefix',
            examples: ['{prefix}setprefix &'],
            aliases: ['prefix'],
            user_permissions: [
                Permissions.MANAGE_GUILD
            ],
            cooldown: 6000
        });
    };

    async CommandRun(message , args) {
        try {
            let GuildData = await GuildModel.findOne({guildId: message.guild.id})

            if(!args[0]) {

               return message.reply({content : 'Sorry, but the "prefix" argument is missing!'})
            }
            
            let prefix = args.join(" ")
            await GuildData.updateOne({
                prefix: prefix
            })
            return message.reply({
                content: `Prefix changed to ${prefix}`
            })
           
        } catch (error) {
            console.error(error);
            return this.client.utils.error(message, error);
        };
    }
}

module.exports = SetPrefix
const { MessageEmbed } = require("discord.js");
const Command = require("../../Structures/Command")

class Help extends Command{
    constructor(...args) {
        super(...args , {
            name: 'help',
            description: 'Getting Info',
            category: 'Info',
            aliases: [],
        });
    };

    async CommandRun(message , args) {
        try {
            if(!args[0]) {
                let cmds;
                cmds = this.client.commandHandler.formatCommands()
                
                let embed = new MessageEmbed()
                .setAuthor({
                    name : 'Commands',
                    iconURL: this.client.user.displayAvatarURL()
                })
                .setTimestamp()
                

                .setTitle('Help')
                .setDescription(`This Bot can be Self Hosted here : [Github Repo](https://ticket-manager.org)\nif you found bugs you can contact me : Ahmed_Mondo#4553\n\nNavigate through the pages using the buttons below`)

                .addField('Pages', '\`1\` - This page\n' + cmds.map((commands, i) => `\`${i + 2}\` - ${commands.category}`).join('\n'))
            let pages = [embed];
                for (const category of cmds) {
                    console.log(category)
                    pages.push(
                       new MessageEmbed()
                        
                        .setTimestamp()
                        .setTitle(`Help - ${category.category}`)
                        .setDescription(category.commands.map(command => `\`${command.name}\` - ${command.description}`).join('\n'))
                    )
                }


                return this.client.buttonPaginator.start(message , pages)

            }
            let commandname = this.client.commands.map(cmd => cmd).find(cmd => cmd.name == args[0])
            if(!commandname) {
                return message.reply(`**I can't find this command.**`)
            }
            let Embed = new MessageEmbed()
            .setTitle(`Command: ${commandname.ping}`)
            .setDescription(`${commandname.description}`)
            .setFooter({
                text: `Requester By ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({dynamic:true})
            })
            .setTimestamp()
           if(commandname.usage) Embed.addField('Usage:' , `${commandname.usage}`)
           if(commandname.aliases?.length >= 1) Embed.addField('Aliases:' , `${commandname.aliases.join(' , ')}`)
           if(commandname.examples?.length >= 1) Embed.addField('Examples:' , `${commandname.examples.join('\n').replaceAll('{prefix}' , this.client.config.prefix)}`)

            console.log(commandname)
            return message.reply({ embeds: [Embed]});
            
        } catch (error) {
            console.error(error);
            return this.client.utils.error(message, error);
        };
    }
}

module.exports = Help
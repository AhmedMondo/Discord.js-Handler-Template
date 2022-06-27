const Command = require("../../Structures/SlashCommand");
const { MessageEmbed } = require("discord.js")
module.exports = class PingCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: 'help',
            description: 'Getting help',
            category: 'Info',
            commandOptions: [
                {
                    name : 'command',
                    type: 'STRING',
                    description : 'Get details of specefic command',
                    required: false
                }
            ]
        });
    };



    async InteractionRun(interaction) {
        try {
            let command = interaction.options.getString('command')
            if(!command) {
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
                    
                    pages.push(
                       new MessageEmbed()
                        
                        .setTimestamp()
                        .setTitle(`Help - ${category.category}`)
                        .setDescription(category.commands.map(command => `\`${command.name}\` - ${command.description}`).join('\n'))
                    )
                }


                return this.client.buttonPaginator.start(interaction , pages , true)

            }
            let commandname = this.client.commands.map(cmd => cmd).find(cmd => cmd.name.toLowerCase() == command.toLowerCase())
            if(!commandname) {
                return interaction.reply(`**I can't find this command.**`)
            }
            let Embed = new MessageEmbed()
            .setTitle(`Command: ${commandname.name}`)
            .setDescription(`${commandname.description}`)
            .setFooter({
                text: `Requester By ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({dynamic:true})
            })
            .setTimestamp()
           if(commandname.usage) Embed.addField('Usage:' , `${commandname.usage.replaceAll('{prefix}' , this.client.prefix)}`)
           if(commandname.aliases?.length >= 1) Embed.addField('Aliases:' , `\`${commandname.aliases.join(' , ').replaceAll('{prefix}' , this.client.prefix)}\``)
           if(commandname.examples?.length >= 1) Embed.addField('Examples:' , `${commandname.examples.join(`\n`).replaceAll('{prefix}' , this.client.prefix)}`)

            
            return interaction.reply({ embeds: [Embed]});
            
        } catch (error) {
            console.error(error);
            return this.client.utils.error(interaction, error);
        };
    };
};
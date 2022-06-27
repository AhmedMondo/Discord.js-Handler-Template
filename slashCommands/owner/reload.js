const Command = require("../../Structures/SlashCommand");

module.exports = class ReloadCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: 'reload',
            description: 'Reload Command',
            category: 'Info',
            commandOptions: [
                {name : 'command' , type: 'STRING' , description : 'Command you want to reload or type all' , required: true}
            ]
        });
    };



    async InteractionRun(interaction) {
        
        try {

            let command  = interaction.options.getString('command')

            if(command.toLowerCase() == "all") {
                this.client.commands.sweep(() => true);
                this.client.commandHandler.loadCommands();
                this.client.slashHandler.loadCommands()

             return interaction.reply({ content: '*Reloaded All Commands/SlashCommands Successfully.*' });
        
            }

            let commandname = this.client.slashcommands.map(cmd => cmd).find(cmd => cmd.name.toLowerCase() == command.toLowerCase())
            if(!commandname) {
                return interaction.reply(`**I can't find this command.**`)
            }



            const normalcommand = this.client.commands.get(command.toLowerCase()) || this.client.commands.map(cmd => cmd).find(({ name }) => name.toLowerCase() === command.toLowerCase());
            const commandFile = normalcommand ? await this.client.commandHandler.loadCommands(normalcommand) : null;
            const commandslash = this.client.slashcommands.get(command.toLowerCase()) || this.client.slashcommands.map(cmd => cmd).find(({ name }) => name.toLowerCase() === command.toLowerCase());
           // console.log(commandslash.category)
            const commandslashFile = commandslash ? await this.client.slashHandler.loadCommands(commandslash) : null;

         
                return interaction.reply({ content: `*Reloaded Command - \`${commandFile.name}\` Successfully*\n\n${commandslash ? `*Reloaded Slash Command \`${commandslash.name}\` Successfully*` : ' '}` });
           
        } catch (error) {
            console.error(error);
            return this.client?.utils.error(interaction, error , false , true , true);
        };
    };
};

const Command = require("../../Structures/Command")

class Reload extends Command{
    constructor(...args) {
        super(...args , {
            name: 'reload',
            description: 'Reload Command',
            category: 'Owner',
            aliases: ['reloadCommand'],
            ownerOnly: true,
            cooldown: 3500
        });
    };

    async CommandRun(message , args) {
        try {
            if(!args[0]) {

               return message.reply({content : "i think you missed command name ?"})
            }
            if(args[0].toLowerCase() == "all") {
                this.client.commands.sweep(() => true);
                this.client.commandHandler.loadCommands();
                this.client.slashHandler.loadCommands()

             return message.reply({ content: '*Reloaded All Commands Successfully.*' });
            }
            let commandname = this.client.commands.map(cmd => cmd).find(cmd => cmd.name == args[0]) 
            if(!commandname) {
                return message.reply(`**I can't find this command.**`)
            }



            const command = this.client.commands.get(args[0]) || this.client.commands.map(cmd => cmd).find(({ name }) => name.toLowerCase() === args[0].toLowerCase());
            const commandFile = command ? await this.client.commandHandler.loadCommands(command) : null;
            const commandslash = this.client.slashcommands.get(args[0]) || this.client.slashcommands.map(cmd => cmd).find(({ name }) => name.toLowerCase() === args[0].toLowerCase());
           // console.log(commandslash.category)
            const commandslashFile = commandslash ? await this.client.slashHandler.loadCommands(commandslash) : null;

         
                return message.reply({ content: `*Reloaded Command - \`${commandFile.name}\` Successfully*\n\n${commandslash ? `*Reloaded Slash Command \`${commandslash.name}\` Successfully*` : ' '}` });
           
        } catch (error) {
            console.error(error);
            return this.client.utils.error(message, error);
        };
    }
}

module.exports = Reload
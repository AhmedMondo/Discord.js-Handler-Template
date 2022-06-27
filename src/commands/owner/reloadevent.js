const { MessageEmbed } = require("discord.js");
const Command = require("../../Structures/Command")
let path = require("path")
const { sync } = require("glob")
class ReloadEvent extends Command{
    constructor(...args) {
        super(...args , {
            name: 'reloadevent',
            description: 'Reload Event',
            category: 'Owner',
            aliases: [],
            ownerOnly: true,
            cooldown: 10000
        });
    };

    async CommandRun(message , args) {
       // console.log(this.client.events)
        try {
            if(!args[0]) {

               return message.reply({content : "i think you missed event name ?"})
            }
            if(args[0].toLowerCase() == "all") {
                                 //this.client.events.sweep(() => true);
                this.client.eventHandler.loadEvents(); 

                //const events = sync(`${this.directory}src/events/**/*.js`).filter((event_file) => !['ready.js'].includes(event_file) );

                          /*   for (const eventFile of events) {
                                delete require.cache[require.resolve(eventFile)];
                                const { name } = path.parse(eventFile);

                                const File = require(eventFile);
                                if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class!`);

                                const event = new File(this.client, name.toLowerCase());
                                if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belong in Events`);

                                this.client.events.set(event.name, event);
                                event.emitter[event.type](name, (...args) => event.EventRun(...args));
                            }; */

             return message.reply({ content: '*Reloaded All Events Successfully.*' });
            }
            let eventname = this.client.events.map(cmd => cmd).find(({ name }) => name.toLowerCase() === args[0].toLowerCase())
            if(!eventname) {
                return message.reply(`**I can't find this Event.**`)
            }


            const event = this.client.events.get(args[0]) || this.client.events.map(cmd => cmd).find(({ name }) => name.toLowerCase() === args[0]);
            const eventFile = eventname ? await this.client.utils.loadEvents(args[0]) : null;
    
          await this.client.utils.loadEvents(eventname)
         
                return message.reply({ content: `*Reloaded Event - \`${eventFile.name}\` Successfully*` });
           
        } catch (error) {
            console.error(error);
            return this.client.utils.error(message, error);
        };
    }
}

module.exports = ReloadEvent
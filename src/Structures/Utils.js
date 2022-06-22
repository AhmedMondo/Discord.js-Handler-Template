let { parse , sep , dirname } = require("path")
const path = require('path');
const glob = require("glob")
const { sync } = require("glob");
const Command = require('./Command.js');
const Event = require('./Event.js');

class Util {
    constructor(bot) {
        this.client = bot
        this.pageControls = [
            "<<",
            "<",
            "x",
            ">",
            ">>"
        ]
    }

    isClass(input) {
        return typeof input === 'function' &&
            typeof input.prototype === 'object' &&
            input.toString().substring(0, 5) === 'class';
    }; 

/*     get directory() {
        return `${dirname(require.main.filename)}${sep}`;
    }; */

    get directory() {
        return `${process.cwd()}${sep}`
    }


    async loadEvents(event = null) {
        if (event) {
            const eventName = sync(`${this.directory}src/events/${event.category.toLowerCase()}/${event.name}.js`.replace(/\\/g, '/'))[0];

            delete require.cache[require.resolve(eventName)];

            const { name } = parse(eventName);
            const File = require(eventName);

            if (!File) return new Error(`*${name} is not a file constructor*`);

            const eventFile = new File(this.client, name.toLowerCase());
            this.client.events.set(eventFile.name, eventFile);

            return eventFile;
        };

        const events = sync(`${this.directory}src/events/**/*.js`.replace(/\\/g, '/'));

        for (const eventFile of events) {
            delete require.cache[require.resolve(eventFile)];
            const { name } = parse(eventFile);

            const File = require(eventFile);
            if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class!`);

            const event = new File(this.client, name.toLowerCase());
            if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belong in Events`);
        console.log(event.category)
            this.client.events.set(event.name, event);
            event.emitter[event.type](name, (...args) => event.EventRun(...args));
        };
    };

    async getEvents() {
        const directory = `${dirname(require.main.filename)}${sep}`;
        const choices = [];
        const events = sync(`${directory}src/events/**/*.js`.replace(/\\/g, '/')).slice(0, 25);

        const isClass = (input) => {
            return typeof input === 'function' &&
                typeof input.prototype === 'object' &&
                input.toString().substring(0, 5) === 'class';
        };

        for (const index of events.keys()) {
            const { name } = parse(events[index]);
            const File = require(events[index]);

            if (isClass(File) && !['ready'].includes(name.toLowerCase())) choices.push({ name, value: name });
        };

        return choices;
    };
    






    async error(interaction, error, custom = false, ephemeral = false , slash = false) {
        try {
            if(slash = true) {
                if (interaction.deferred && !interaction.replied) {
                    await interaction.editReply({ content: `An Error Occurred: \`${error.message}\`!` });
                    return custom ? await interaction.followUp({ content: `Custom Error Message: ${custom}` }) : null;
                } else if (interaction.replied) {
                    await interaction.followUp({ content: `An Error Occurred: \`${error.message}\`!` });
                    return custom ? await interaction.followUp({ content: `Custom Error Message: ${custom}` }) : null;
                } else {
                    await interaction.reply({ content: `An Error Occurred: \`${error.message}\`!\n\n\`\`\`${error.stack}\`\`\``, ephemeral });
                    return custom ? await interaction.followUp({ content: `Custom Error Message: ${custom}` }) : null;
                };
            } else {
                    await interaction.reply({ content: `An Error Occurred: \`${error.message}\`!\n\n\`\`\`${error.stack}\`\`\`` });
                    return custom ? await interaction.reply({ content: `Custom Error Message: ${custom}` }) : null;

            }

        } catch (error) {
            console.error(error);
        }
    };
}

module.exports = Util;
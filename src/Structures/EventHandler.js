const { readdirSync, statSync } = require('fs');
const path = require('path');
let { parse , sep , dirname } = require("path")
let glob = require("glob")
const Event = require("./Event")
class EventHandler {
    constructor(client, {
        directory
    }) {
        this.client = client;
        this.events = [];
        this.directory = directory;
    }
    isClass(input) {
        return typeof input === 'function' &&
            typeof input.prototype === 'object' &&
            input.toString().substring(0, 5) === 'class';
    }; 
    async init() {
        await this.loadEvents();
        this.client.classLoader.push('[ClassLoader] EventHandler loaded');
    }
    formatEvents() {
        let formatted = [];
        const categories = readdirSync(this.directory);
        for (const category of categories) {
            let events = this.getEvents(path.join(this.directory, category).split(/\\/g).join('/'));
            let eventdData = [];
            for (const event of events) {
                let data = require(`${event}`)
                let cmddata = this.client.events.get(data.name.toLowerCase())
                eventdData.push({
                    name: data.name
                })
            }
            formatted.push({ category: category, events: eventdData });
        }
        return formatted;
    }
    getEvents(directory) {
        const results = [];

        (function read(dir) {
            const files = readdirSync(dir);
            for (const file of files) {
                const filepath = path.join(dir, file).split(/\\/g).join('/');
                if (statSync(filepath).isDirectory()) {
                    read(filepath);
                } else {
                    results.push(filepath);
                }
            }
        }(directory));
        return results;
    }

    get dir() {
        return `${process.cwd()}${sep}`
    }
    async loadEvents(event = null) {
        if (event) {
            const  eventName  = glob.sync(`${this.dir}src/events/${event.category.split(' ').join('-').toLowerCase()}/${event.name.split(' ').join('-').toLowerCase()}.js`.replace(/\\/g, '/'))[0]

            delete require.cache[require.resolve(eventName)];

            const { name } = parse(eventName);
            const  File  = require(eventName);

            if (!File) return new Error(`*${name} is not a file constructor*`);

            const eventFile = new File(this.client, name.toLowerCase());
            eventFile.path = eventName
            this.client.events.set(eventFile.name, eventFile);
            return eventFile;
        };

        let files = this.getEvents(this.directory);
        for (let eventFile of files) {
            delete require.cache[require.resolve(eventFile)];
            
            const { name } = parse(eventFile);

            const File = require(eventFile);
            if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class.`);

            const event = new File(this.client, name.toLowerCase());
            if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesnt belong in Events.`);

            this.client.events.set(event.name, event);
            event.path = eventFile
            event.emitter[event.type](name, (...args) => event.EventRun(...args));

        }
    }
}

module.exports = EventHandler;
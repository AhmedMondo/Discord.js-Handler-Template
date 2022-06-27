const bot = require("../../index.js")

class Event {
       /**
     * 
     * @param {bot} bot Client
     * @param {string} name Event Name
     * @param {object} options Event Options
     * @param {string} options.type Type of Event
     * @param {boolean} options.once Once Event Emitter Boolean
     * @param {Function} options.emitter Event Emitter
     */
    constructor(bot , name , options= {}) {
        this.client = bot;
        this.name = options.name;
        this.category = options.category;
        this.type = options.once ? 'once' : 'on';
        this.emitter = (typeof options.emitter === 'string' ? this.client[options.emitter] : options.emitter) || this.client;
    };
    async EventRun(...args) {
        throw new Error(`The run method has not been implemented in ${this.name}`);
    };
}

module.exports = Event;
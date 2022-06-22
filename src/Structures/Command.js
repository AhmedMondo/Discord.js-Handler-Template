const bot = require("../../index.js")
class Command {
        /**
     * 
     * @param {bot} bot Client
     * @param {string} name Command Name
     * @param {string} options.name Command Name
     * @param {string} options.description Command Description
     * @param {array} options.aliases Command Aliases
     * @param {string} options.category Command Category
     * @param {string} options.usage Command Usage
     * @param {boolean} options.guild Command Guild only 
     * @param {array} options.permissions Command Permissions
     */
    constructor(bot, name, options = {} ) {
        this.client = bot;
        this.name = options.name || name;
        this.description = options.description || null;
        this.aliases = options.aliases || null
        this.category = options.category;
        this.usage = options.usage || null;
        this.examples = options.examples || [];
        this.ownerOnly = options.ownerOnly || false;
        this.permissions = options.permissions || [];
       
    };
    async CommandRun(message) {
        throw new Error(`MessageCommand ${this.name} doesn't provide a run method!`);
    };
}

module.exports = Command;
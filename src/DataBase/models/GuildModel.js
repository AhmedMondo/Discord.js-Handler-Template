const mongoose = require("mongoose")

let guildSchema = new mongoose.Schema({
    guildId: String,
    prefix: String,
})

module.exports = new mongoose.model("guilds" , guildSchema)
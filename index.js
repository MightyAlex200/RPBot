const Discord = require("discord.js")
const fs = require("fs")
const client = new Discord.Client()
const token = fs.readFileSync("credentials", "utf-8")
const commandModule = require("./commandModule")
const characterModule = require("./characterModule")

// Connecting things up
client.on("ready", () => {
    console.log("Client ready")
})

client.on("message", commandModule.messageRecieved)

// Load characters
characterModule.loadCharacters()

// Logging in
client.login(token).catch((e) => { console.error("Error logging in: " + e) })
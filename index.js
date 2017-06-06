const Discord = require("discord.js")
const fs = require("fs")
const client = new Discord.Client()
const token = fs.readFileSync("credentials", "utf-8")
let commandChar = ';'

// The function that will be called when a message is posted in chat
function messageRecieved(m) {
    if (m.content.startsWith(commandChar)) { // Starts with ';' (or what ever commandChar is set to right now)
        parseCommand(m.content.slice(commandChar.length), m) // Send to parseCommand
    }
}

// Called when message posted and started with commandChar
function parseCommand(command, message) {
    let args = command.split(/\s/) // For easy access later
    switch (args[0].toLowerCase()) { // This is where the command is actually parsed (case insensitive)
        case "test": // Simple test command
            message.reply("working!").catch((e) => { console.error("Error replying to message: " + e) })
            break;
    }
}

// Connecting things up

client.on("ready", () => {
    console.log("Client ready")
})

client.on("message", messageRecieved)

// Logging in
client.login(token).catch((e) => { console.error("Error logging in: " + e) })
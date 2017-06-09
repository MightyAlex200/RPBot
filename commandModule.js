let commandModule = module.exports = {}
const characterModule = require("./characterModule")
const fs = require("fs")

const messageCatch = e => { console.error("Error replying to message: " + e) }

commandModule.commandChar = ";"

// The function that will be called when a message is posted in chat
commandModule.messageRecieved = function (m) {
    if (m.content.startsWith(commandModule.commandChar)) { // Starts with ';' (or what ever commandChar is set to right now)
        commandModule.parseCommand(m.content.slice(commandModule.commandChar.length), m) // Send to parseCommand
    }
}

// Called when message posted and started with commandChar
commandModule.parseCommand = function (commandText, message) {
    let command = commandText.split(/\s/)[0] // The actual command to look for in commands
    let passArgs = commandText.substring(commandText.indexOf(" ") + 1).split(/,\s*/) // For easy access later
    let commandObject = commandModule.commands.find((c) => c[0] === command.toLowerCase()) // Find the actual command from commands
    if (commandObject) {
        message.reply(commandObject[1](passArgs))
    } else {
        message.reply("Command not found.").catch(messageCatch)
    }
}

// Give help on commands
commandModule.helpCommand = function ({ [0]: inputCommand }) {
    if (!inputCommand || inputCommand === "help") {
        return commandModule.listCommands() // If nothing passed as an argument, all commands will be listed
    } else {
        let foundCommand = commandModule.commands.find((c) => c[0] === inputCommand.toLowerCase())
        if (foundCommand !== undefined) {
            return commandModule.describeCommand(foundCommand)
        } else {
            return "Command not found."
        }
    }
}

// List all commands
commandModule.listCommands = function () {
    return commandModule.commands.reduce(
        (str, command) => str + commandModule.describeCommand(command), "List of commands: (seperate arguments with comma)\n"
    )
}

// Provide a description of a command
commandModule.describeCommand = function (command) {
    return `${command[0]}: \n\t${command[2]}\n\tArguments: ${command[3]}\n`
}

commandModule.commands = [
    // [command, function, description, arguments]
    ["test", () => "working!", "Test command, returns 'working!' if bot is working", "none"],
    ["addcharacter", characterModule.addCharacter, "Add a character to the list of characters", "name, gender, age, species"],
    ["characters", characterModule.listCharacters, "Returns list of all characters currently registered", "none"],
    ["removecharacter", characterModule.removeCharacter, "Remove a character from the list of characters", "name"],
    ["characterinfo", characterModule.describeCharacter, "Gives some information about a character", "name"],
    ["help", commandModule.helpCommand, "Get help using the bot", "command name (optional)"],
    ["changecommandchar", ({ [0]: newChar }) => { commandModule.commandChar = newChar || ";"; return `Changed commandChar to ${commandModule.commandChar}` }, "Change the command character used by the bot (default ;)", "new char"],
    ["savecharacters", characterModule.saveCharacters, "Save characters to characters.json", "none"],
    ["loadcharacters", characterModule.loadCharacters, "Load characters from characters.json, the backup created with savecharacters", "none"],
    ["editcharacter", characterModule.changeCharacterProperty, "Change a character's properties (name, gender, etc). Doesn't have to be anything specific", "name, property, value"],
    ["characterproperties", characterModule.getCharacterProperties, "Get all properties of a character (set by editcharacter)", "name"]
]
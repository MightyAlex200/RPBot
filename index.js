const Discord = require("discord.js")
const fs = require("fs")
const client = new Discord.Client()
const token = fs.readFileSync("credentials", "utf-8")
const messageCatch = e => { console.error("Error replying to message: " + e) }
let commandChar = ';'
let characters = []
const commands = [
    // [command, function, description, arguments]
    ["test", () => "working!", "Test command, returns 'working!' if bot is working", "none"],
    ["addcharacter", addCharacter, "Add a character to the list of characters", "name, gender, age, species"],
    ["characters", listCharacters, "Returns list of all characters currently registered", "none"],
    ["removecharacter", removeCharacter, "Remove a character from the list of characters", "name"],
    ["characterinfo", describeCharacter, "Gives some information about a character", "name"],
    ["help", helpCommand, "Get help using the bot", "command name (optional)"],
    ["changecommandchar", ({ [0]: newChar }) => { commandChar = newChar || ";"; return `Changed commandChar to ${commandChar}` }, "Change the command character used by the bot (default ;)", "new char"],
    ["savecharacters", saveCharacters, "Save characters to characters.json", "none"],
    ["loadcharacters", loadCharacters, "Load characters from characters.json, the backup created with savecharacters", "none"]
]

// The function that will be called when a message is posted in chat
function messageRecieved(m) {
    if (m.content.startsWith(commandChar)) { // Starts with ';' (or what ever commandChar is set to right now)
        parseCommand(m.content.slice(commandChar.length), m) // Send to parseCommand
    }
}

// Called when message posted and started with commandChar
function parseCommand(command, message) {
    let args = command.split(/\s/) // For easy access later
    let passArgs = args.splice(1) // Easy to pass into commands, they don't need to know EXACTLY what the user typed
    let commandObject = commands.find((c) => c[0] == args[0].toLowerCase()) // Find the actual command from commands
    if (commandObject == undefined) {
        message.reply("Command not found.").catch(messageCatch)
    } else {
        message.reply(commandObject[1](passArgs))
    }
}

// Add character to 'character' variable
function addCharacter({ [0]: newName, [1]: newGender, [2]: newAge, [3]: newSpecies }) {
    // Check to see if character already exists
    // TODO: make good lol
    if (characterExists(newName)) {
        return "This character already exists!"
    }

    // Actually add character
    characters.push({ name: newName, gender: newGender, age: newAge, species: newSpecies })

    return "Created character " + newName
}

// Remove character from character list
function removeCharacter({ [0]: newName }) {
    characters = characters.filter(({ name }) => name != newName)
    return `All characters with the name ${newName} have been spliced from the character array.`
}

// I WoNdeR wHat tHIs dOes
function characterExists(name) {
    return characters.find((char) => char.name.toLowerCase() == name.toLowerCase()) // Returns undefined if character not found, otherwise returns character
}

// Return list of all characters in easy to read string format
function listCharacters() {
    return characters.reduce((str, { name, gender, age, species }) => str + (`${name}: ${age}, ${gender}, ${species}\n`), "List of characters: \n")
}

// Return a brief description of the character
function describeCharacter({ [0]: newName }) {
    let char = characterExists(newName)
    if (char != undefined) {
        return `${char.name} is a ${char.gender} ${char.species} that is ${char.age} years old`
    }
    return `Character ${newName} not found!`
}

// Give help on commands
function helpCommand({ [0]: inputCommand }) {
    if (inputCommand == undefined) {
        return listCommands() // If nothing passed as an argument, all commands will be listed
    } else {
        let foundCommand = commands.find((c) => c[0] == inputCommand.toLowerCase())
        if (foundCommand != undefined) {
            return describeCommand(foundCommand)
        } else {
            return "Command not found."
        }
    }
}

// List all commands
function listCommands() {
    return commands.reduce(
        (str, command) => str + describeCommand(command), "List of commands:\n"
    )
}

// Provide a description of a command
function describeCommand(command) {
    return `${command[0]}: \n\t${command[2]}\n\t${command[3]}\n`
}

// Save all characters to characters.json
function saveCharacters() {
    fs.writeFileSync("characters.json", JSON.stringify(characters))
    return "Done"
}

// Load all characters from characters.json
function loadCharacters() {
    characters = JSON.parse(fs.readFileSync("characters.json", "utf-8"))
    return "Done"
}

// Connecting things up

client.on("ready", () => {
    console.log("Client ready")
})

client.on("message", messageRecieved)

// Load characters

loadCharacters()

// Logging in
client.login(token).catch((e) => { console.error("Error logging in: " + e) })
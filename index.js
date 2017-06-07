const Discord = require("discord.js")
const fs = require("fs")
const client = new Discord.Client()
const token = fs.readFileSync("credentials", "utf-8")
const messageCatch = e => { console.error("Error replying to message: " + e) }
let commandChar = ';'
let characters = []

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
    switch (args[0].toLowerCase()) { // This is where the command is actually parsed (case insensitive)
        case "test": // Simple test command
            message.reply("working!").catch(messageCatch)
            break;
        case "addcharacter":
            message.reply(addCharacter(passArgs)).catch(messageCatch)
            break;
        case "characters":
            message.reply(listCharacters()).catch(messageCatch)
            break;
        case "removecharacter":
            message.reply(removeCharacter(passArgs)).catch(messageCatch)
            break;
        case "characterinfo":
        case "characterinformation":
            message.reply(describeCharacter(passArgs)).catch(messageCatch)
            break;
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

// Guess what this does lol
function removeCharacter({ [0]: newName }) {
    characters = characters.filter(({ name }) => name != newName)
    return "All characters with the name \"" + newName + "\" have been spliced from the character array."
}

// I WoNdeR wHat tHIs dOes
function characterExists(name) {
    return characters.find((char) => char.name.toLowerCase() == name.toLowerCase())
}

// Return list of all characters in easy to read string format
function listCharacters() {
    return characters.reduce((str, { name, gender, age, species }) => str + ('"' + name + '": ' + age + ", " + gender + ", " + species + "\n"), "List of characters: \n")
}

function describeCharacter({ [0]: newName }) {
    let char = characters.find(({ name }) => newName == name)
    if (char != undefined) {
        return `${char.name} is a ${char.gender} ${char.species} that is ${char.age} years old`
    }
    return `Character ${newName} not found!`
}

// Connecting things up

client.on("ready", () => {
    console.log("Client ready")
})

client.on("message", messageRecieved)

// Logging in
client.login(token).catch((e) => { console.error("Error logging in: " + e) })
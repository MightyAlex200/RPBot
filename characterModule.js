let characterModule = module.exports = {}
const commandModule = require("./commandModule")
const fs = require("fs")

characterModule.characters = []

// Add character to 'character' variable
characterModule.addCharacter = function ({ [0]: newName, [1]: newGender, [2]: newAge, [3]: newSpecies }) {
    // Check to see if character already exists
    // TODO: make good lol
    if (characterModule.characterExists(newName)) {
        return "This character already exists!"
    }

    // Actually add character
    characterModule.characters.push({ name: newName, gender: newGender, age: newAge, species: newSpecies })

    return "Created character " + newName
}

// Remove character from character list
characterModule.removeCharacter = function ({ [0]: newName }) {
    characterModule.characters = characterModule.characters.filter(({ name }) => name !== newName)
    return `All characters with the name ${newName} have been spliced from the character array.`
}

// I WoNdeR wHat tHIs dOes
characterModule.characterExists = function (name) {
    return characterModule.characters.find((char) => char.name.toLowerCase() === name.toLowerCase()) // Returns undefined if character not found, otherwise returns character
}

// Return list of all characters in easy to read string format
characterModule.listCharacters = function () {
    return characterModule.characters.reduce((str, { name, gender, age, species }) => str + (`${name}: ${age}, ${gender}, ${species}\n`), "List of characters: \n")
}

// Return a brief description of the character
characterModule.describeCharacter = function ({ [0]: newName }) {
    let char = characterModule.characterExists(newName)
    if (char) {
        return `${char.name} is a ${char.gender} ${char.species} that is ${char.age} years old`
    }
    return `Character ${newName} not found!`
}

// Change the property of a character (name, gender, etc)
characterModule.changeCharacterProperty = function ({ [0]: name, [1]: property, [2]: value }) {
    let character = characterModule.characterExists(name)
    if (character && value) {
        character[property] = value
    } else {
        return "Character or value invalid"
    }
    return "Done"
}

characterModule.getCharacterProperties = function ({ [0]: name }) {
    let character = characterModule.characterExists(name)
    if (character) {
        let characterDescription = ""
        for (let property in character) {
            let value = character[property]
            characterDescription += `${property}: ${value}\n`
        }
        return characterDescription
    } else {
        return "Character not found"
    }
}

// Save all characters to characters.json
characterModule.saveCharacters = function () {
    fs.writeFileSync("characters.json", JSON.stringify(characterModule.characters))
    return "Done"
}

// Load all characters from characters.json
characterModule.loadCharacters = function () {
    characterModule.characters = JSON.parse(fs.readFileSync("characters.json", "utf-8"))
    return "Done"
}
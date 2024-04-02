const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

const Pokemon = require('../model/pokemon.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poke_gacha')
        .setDescription('Get a random pokemon from the gacha'),
    async execute(interaction) {
        console.log("poke_gacha command is executed");
        const randomPokemonId = Math.floor(Math.random() * 151) + 1;
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`);
        // const randomPokemon = response.data.results[Math.floor(Math.random() * response.data.results.length)];
        
        // console.log(response.data);
        // console.log(response.data.name);
        // console.log(response.data.types[0].type.name);
        // console.log(response.data.id);
        const randomPokemon = new Pokemon(
            response.data.name, 
            response.data.types[0].type.name, 
            response.data.id);
        // await interaction.reply(`You got a ${randomPokemon.name}!`);

        console.log(`You got a ${randomPokemon.name}!`);
        // console.log(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomPokemon.id}.png"`);

        await interaction.reply({
            embeds: [{
                color : 0x0099ff,
                title : "Poke Gacha",
                description : `You got a ${randomPokemon.name}!`,
                image: {
                    url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomPokemon.id}.png`
                },
                fields: [
                    {
                        name: "Type",
                        value: randomPokemon.type,
                        inline: true
                    }
                ]
            }]
        });
    },
}
const { SlashCommandBuilder } = require('discord.js');
const { axios } = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poke_gacha')
        .setDescription('Get a random pokemon from the gacha!'),
    async execute(interaction) {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1118');
        const randomPokemon = response.data.results[Math.floor(Math.random() * response.data.results.length)];
        await interaction.reply(`You got a ${randomPokemon.name}!`);
    },
}
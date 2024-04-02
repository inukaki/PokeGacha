const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

const Pokemon = require('../model/pokemon.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poke_gacha')
        .setDescription('Get a random pokemon from the gacha'),
    async execute(interaction) {
        // 1~151の乱数を生成
        const randomPokemonId = Math.floor(Math.random() * 151) + 1;

        // ポケモンの情報を取得
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`);

        // ポケモンの情報をPokemonクラスに格納
        const randomPokemon = new Pokemon(
            response.data.name, 
            response.data.types.map(type => type.type.name), 
            response.data.id);


        // ポケモンの情報を送信
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
                        value: randomPokemon.types.join(", "),
                        inline: true
                    }
                ]
            }]
        });
    },
}
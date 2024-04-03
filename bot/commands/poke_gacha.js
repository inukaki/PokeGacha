const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

const Pokemon = require('../model/pokemon.js');
const admin = require('firebase-admin');
const jpName = require('../jpName.json');
const jpType = require('../jpType.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poke_gacha')
        .setDescription('Get a random pokemon from the gacha'),
    async execute(interaction) {
        // 1~151の乱数を生成
        const randomPokemonId = Math.floor(Math.random() * 151) + 1;
        
        const db = admin.firestore();
        const docRef = db.collection('servers').doc(interaction.guild.id);

        // ポケモンの獲得状況を取得
        const doc = await docRef.get();
        let pokemons = doc.data().pokemons;
        let num_pokemons = doc.data().num_pokemons;

        // ポケモンの情報を取得
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`);

        // ポケモンの情報をPokemonクラスに格納
        const randomPokemon = new Pokemon(
            jpName[response.data.id], 
            response.data.types.map(type => jpType[type.type.name]), 
            response.data.id);

        let description = "";
        
        // ポケモンが未獲得の場合
        if (pokemons[randomPokemon.id] == false) {
            pokemons[randomPokemon.id] = true;
            num_pokemons++;
            description += "[NEW]\n";
            (async () => {
                await docRef.set({
                    pokemons: pokemons,
                    num_pokemons: 0
                });
            })();
        }

        description += `You got a ${randomPokemon.name}!`;



        // ポケモンの情報を送信
        await interaction.reply({
            embeds: [{
                color : 0x0099ff,
                title : "Poke Gacha",
                description : description,
                image: {
                    url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomPokemon.id}.png`
                },
                fields: [
                    {
                        name: "ID",
                        value: randomPokemon.id,
                        inline: true
                    },
                    {
                        name: "Type",
                        value: randomPokemon.types.join(", "),
                        inline: true
                    }
                ]
            }]
        });
        // 出たポケモンをデータベースに保存
        pokemons[randomPokemon.id] = true;
        (async () => {
            await docRef.set({
                pokemons: pokemons,
                num_pokemons: num_pokemons
            });
        })();
    },
}
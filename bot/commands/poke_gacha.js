const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

const Pokemon = require('../model/pokemon.js');
const admin = require('firebase-admin');
const jpName = require('../jpName.json');
const jpType = require('../jpType.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poke_gacha')
        .setDescription('ポケガチャを引きます'),
    async execute(interaction) {

        const db = admin.firestore();
        const docRef = db.collection('servers').doc(interaction.guild.id);
        const doc = await docRef.get();

        // ユーザーの最後のガチャ日を取得
        const users = doc.data().users;
        const LastGachaDate = users[interaction.user.id];

        // 現在の日時を取得
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if(LastGachaDate == today.getTime()){
            await interaction.reply({
                content: "本日はもうガチャを引いています",
                ephemeral: true
            });
            return;
        }
        // ユーザーの最後のガチャ日を更新
        users[interaction.user.id] = today.getTime();



        
        // 1~151の乱数を生成
        const randomPokemonId = Math.floor(Math.random() * 151) + 1;

        // ポケモンの獲得状況を取得
        let pokemons = doc.data().pokemons;
        let num_pokemons = doc.data().num_pokemons;
        let num_register_pokemons = doc.data().num_register_pokemons;

        // ポケモンの情報を取得
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`);

        // ポケモンの情報をPokemonクラスに格納
        const randomPokemon = new Pokemon(
            jpName[response.data.id], 
            response.data.types.map(type => jpType[type.type.name]), 
            response.data.id);

        // ポケモンの説明を作成
        let description = "";

        // ポケモンが初ゲットだった場合
        if (pokemons[randomPokemon.id].count == 0) {
            description += "[NEW] ";
            pokemons[randomPokemon.id].get_player = interaction.user.globalName;
            num_register_pokemons++;
        }
        description += `No.${randomPokemon.id} ${randomPokemon.name}`;

        
        // ポケモンの獲得数を更新
        num_pokemons++;
        pokemons[randomPokemon.id].count++;
        (async () => {
            await docRef.set({
                pokemons: pokemons,
                num_pokemons: num_pokemons,
                num_register_pokemons: num_register_pokemons,
                users: users
            });
        })();


        // ポケモンの情報を送信
        await interaction.reply({
            embeds: [{
                color : 0x0099ff,
                title : `${interaction.user.globalName}は${randomPokemon.name}を捕まえた！`,
                description : description,
                thumbnail: {
                    url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomPokemon.id}.png`
                },
                fields: [
                    {
                        name: "タイプ",
                        value: randomPokemon.types.join(", "),
                        inline: true
                    },
                    {
                        name: "捕まえた回数",
                        value: pokemons[randomPokemon.id].count,
                        inline: true
                    },
                    {
                        name: "図鑑登録状況",
                        value: `${num_register_pokemons}/151`,
                        inline: false
                    }
                ],
            }]
        });
    },
}
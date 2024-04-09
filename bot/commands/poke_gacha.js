const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

const Pokemon = require('../model/pokemon.js');
const admin = require('firebase-admin');
const jpName = require('../jpName.json');
const jpType = require('../jpType.json');
const Pokemons = require('../Pokemons.json')

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

        // if(LastGachaDate == today.getTime()){
        //     await interaction.reply({
        //         content: "本日はもうガチャを引いています",
        //         ephemeral: true
        //     });
        //     return;
        // }
        // ユーザーの最後のガチャ日を更新
        users[interaction.user.id] = today.getTime();


        // ポケモンをガチャで取得
        const rarity = Math.random();
        let selectPokemon;
        if(rarity < 0.35){
            selectPokemon = Pokemons.filter(function(pokemon){
                return pokemon.rarity == 1;
            });
        }else if(rarity < 0.6){
            selectPokemon = Pokemons.filter(function(pokemon){
                return pokemon.rarity == 2;
            });
        }else if(rarity < 0.85){
            selectPokemon = Pokemons.filter(function(pokemon){
                return pokemon.rarity == 3;
            });
        }else if(rarity < 0.95){
            selectPokemon = Pokemons.filter(function(pokemon){
                return pokemon.rarity == 4;
            });
        }else{
            selectPokemon = Pokemons.filter(function(pokemon){
                return pokemon.rarity == 5;
            });
        }
        const randomPokemonId = selectPokemon[Math.floor(Math.random() * selectPokemon.length)].id;


        // ポケモンの獲得状況を取得
        let pokemons = doc.data().pokemons;
        let num_pokemons = doc.data().num_pokemons;
        let num_register_pokemons = doc.data().num_register_pokemons;

        // ポケモンの情報を取得
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`);

        // ポケモンの情報をPokemonクラスに格納
        const randomPokemon = new Pokemon(
            Pokemons[randomPokemonId].name, 
            response.data.types.map(type => jpType[type.type.name]), 
            response.data.id,
            Pokemons[randomPokemonId].rarity);

        // ポケモンの説明を作成
        let description = "";

        // ポケモンが初ゲットだった場合
        if (pokemons[randomPokemon.id].count == 0) {
            // description += "[NEW] ";
            pokemons[randomPokemon.id].get_player = interaction.user.globalName;
            num_register_pokemons++;
        }
        //"☆"をレア度に応じて追加
        for (let i = 0; i < randomPokemon.rarity; i++) {
            description += "⭐";
        }
        // for(let i = 0; i < 5-randomPokemon.rarity; i++){
        //     description += "　";
        // }   
        description += ` ${randomPokemon.name}`;
        
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

        // レア度に応じて色を変更
        let color;
        if(randomPokemon.rarity == 1){
            color = 0x00ff00; // 緑
        }
        else if(randomPokemon.rarity == 2){
            color = 0x0000ff; // 青
        }
        else if(randomPokemon.rarity == 3){
            color = 0xffa500; // オレンジ
        }
        else if(randomPokemon.rarity == 4){
            color = 0xff00ff; // ピンク
        }
        else{
            color = 0xff0000; // 赤
        }

        // ポケモンの情報を送信
        await interaction.reply({
            embeds: [{
                color : color,
                title : `${interaction.user.globalName}は${randomPokemon.name}を捕まえた！`,
                description : description,
                thumbnail: {
                    url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomPokemon.id}.png`
                },
                fields: [
                    {
                        name: "図鑑番号",
                        value: `No.${randomPokemon.id}`,
                        inline: true
                    },
                    {
                        name: "タイプ",
                        value: randomPokemon.types.join(", "),
                        inline: true
                    },
                    {
                        name: "レアリティ",
                        value: `☆${randomPokemon.rarity}`,
                        inline: true
                    },
                    {
                        name: "捕まえた回数",
                        value: `${pokemons[randomPokemon.id].count}回`,
                        inline: true
                    },
                    {
                        name: "図鑑登録状況",
                        value: `${num_register_pokemons}/151`,
                        inline: true
                    }
                ],
            }]
        });
    },
}
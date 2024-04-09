const { SlashCommandBuilder } = require('discord.js');

const admin = require('firebase-admin');
const Pokemons = require('../Pokemons.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('ポケモン図鑑を表示します'),
    async execute(interaction) {

        // ポケモンの獲得状況を取得
        const db = admin.firestore();
        const docRef = db.collection('servers').doc(interaction.guild.id);
        const doc = await docRef.get();
        let pokemons = doc.data().pokemons;
        let num_pokemons = doc.data().num_pokemons;
        let num_register_pokemons = doc.data().num_register_pokemons;  
        
        // レスポンスを作成
        let response = `## ${interaction.guild.name}のポケモン図鑑\n`;
        response += "```diff\n";
        response += String("  レア No.   ポケモン名").padEnd(19, '　');
        response += String("獲得数").padEnd(4, '　');
        response += "初ゲットプレイヤー\n";
        for (let i = 1; i <= 151; i++) {
            let rarity = `☆${Pokemons[i].rarity}`;
            let number =String(i).padStart(3, '0');
            let name = String(Pokemons[i].name).padEnd(6, '　');
            let count = String(pokemons[i].count).padStart(3, ' ');
            let player = String(pokemons[i].get_player).padEnd(10, '　');
            let line = "";
            if(pokemons[i].count == 0) line += "- "
            else line += "+ "; 
            line += `${rarity} No.${number} ${name} : ${count}匹    ${player}\n`;
            if(response.length + line.length + 3 > 2000){
                response += "```";
                await interaction.channel.send(response);
                response = "```diff\n";
            }
            response += line;
        }
        if(response.length + 50 > 2000){
            response += "```";
            await interaction.channel.send(response);
            response = "```diff\n";
        }
        response += `総獲得ポケモン数 : ${num_pokemons}匹\n`;
        response += `登録ポケモン数　 : ${num_register_pokemons}/151匹`;
        response += "```";
        await interaction.channel.send(response);
    },
}
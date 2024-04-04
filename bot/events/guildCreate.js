const admin = require('firebase-admin');


module.exports = {
    guildCreateEvents: function(client) {
        client.on('guildCreate', async guild => {
            try {
                const id = guild.id;

                const db = admin.firestore();
                const docRef = db.collection('servers').doc(id);
                const pokemons = [];
                for (let i = 1; i <= 152; i++) {
                    pokemons.push({
                        get_player:"",
                        count : 0
                    });
                }
                (async () => {
                    await docRef.set({
                        pokemons: pokemons,
                        num_pokemons: 0,
                        num_register_pokemons: 0,
                        users: {}
                    });
                })();
            }
            catch (error) {
                console.error('エラーが発生しました:', error);
            }
        });
    }
}
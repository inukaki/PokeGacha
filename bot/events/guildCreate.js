const axios = require('axios');
const { getFirestore, collection, addDoc, getDocs, query, where } = require('firebase/firestore');

module.exports = {
    guildCreateEvents: function(client) {
        client.on('guildCreate', async guild => {
            try {
                const id = guild.id;
                const app = initializeApp(firebaseConfig);
                const db = getFirestore(app);
            }
            catch (error) {
                console.error('エラーが発生しました:', error);
            }
        });
    }
}
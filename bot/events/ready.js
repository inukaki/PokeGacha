const admin = require('firebase-admin');
const SerciveAccount = require('../ServiceAccountKey.json');

module.exports = {

    readyEvents: function(client) {

        // botを起動したときに実行されるイベント
        client.on('ready', () => {
            console.log('ボットが起動したよ');

            // Firebaseの初期化
            admin.initializeApp({
                credential: admin.credential.cert(SerciveAccount)
            });

            const db = admin.firestore();
            const docRef = db.collection('users').doc('alovelace');
            (async () => {
                await docRef.set({
                    first: 'Ada',
                    last: 'Lovelace',
                    born: 1815
                });
            })();
        });
    }
}
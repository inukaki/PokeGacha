const admin = require('firebase-admin');
const ServiceAccount = require('../ServiceAccountKey.json');

module.exports = {

    readyEvents: function(client) {

        // botを起動したときに実行されるイベント
        client.on('ready', () => {
            console.log('ボットが起動したよ');

            // Firebaseの初期化
            admin.initializeApp({
                credential: admin.credential.cert(ServiceAccount)
            });
            
        });
    }
}
const { initializeApp } = require('firebase/app');
const { apiKey ,
        authDomain ,
        projectId ,
        storageBucket ,
        messagingSenderId ,
        appId , 
        measurementId
    } = require('../config.json');
const { getFirestore, setDoc, doc } = require('firebase/firestore');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const SerciveAccount = require('../ServiceAccountKey.json');

module.exports = {

    readyEvents: function(client) {

        // botを起動したときに実行されるイベント
        client.on('ready', () => {
            console.log('ボットが起動したよ');

            // Firebaseの初期化
            // const firebaseConfig = {
            //     apiKey: apiKey,
            //     authDomain: authDomain,
            //     projectId: projectId,
            //     storageBucket: storageBucket,
            //     messagingSenderId: messagingSenderId,
            //     appId: appId,
            //     measurementId: measurementId
            // };
            // const app = initializeApp(firebaseConfig);
            // const db = getFirestore(app);
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
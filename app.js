/*----------------------- Importar Express-----------------------*/
const express = require ('express')
const app = express();

/*-----------------------Firebase/Firestore--------------------- */
const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('./credentials/firebase/subiza-logbook-firebase-adminsdk-6i5c3-e59b4f3da4.json');
// Inicializar Firebase Admin SDK
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
});
// Obtener una referencia a Firestore
const db = firebaseAdmin.firestore();
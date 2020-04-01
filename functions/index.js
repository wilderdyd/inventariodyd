const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
admin.initializeApp();
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const APP_NAME = 'Inventario D&D';
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'wilder@grupodyd.com',
        pass: 'Gmail98.'
    },
});

exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
    const email = user.email;
    const displayName = user.displayName;
    console.log('Se va enviar mensaje bienvenida enviado a :', email);
    return sendWelcomeEmail(email, displayName);
});

async function sendWelcomeEmail(email, displayName){
    const mailOptions = {
        from: `Inventario D&D <noreply@inventariodyd.com>`,
        to: email,
    };

    mailOptions.subject = `Bienvenido a ${APP_NAME}`
    mailOptions.text = `Hola ${displayName || ''}! Bienvendio a ${APP_NAME}. Esperamos que tengas una gran experiencia.`;
    await mailTransport.sendMail(mailOptions);
    console.log('Mensaje bienvenida enviado a :', email);
    return null;
}
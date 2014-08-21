'use strict';

module.exports = {
    db: 'mongodb://localhost/mean-test',
    port: 3001,
    app: {
        name: 'MEAN - A Modern Stack - Test'
    },
    facebook: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    },
    twitter: {
        clientID: 'CONSUMER_KEY',
        clientSecret: 'CONSUMER_SECRET',
        callbackURL: 'http://localhost:3000/auth/twitter/callback'
    },
    github: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    google: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    linkedin: {
        clientID: 'API_KEY',
        clientSecret: 'SECRET_KEY',
        callbackURL: 'http://localhost:3000/auth/linkedin/callback'
    },
    emailFrom : 'support@rest.qa', // sender address like ABC <abc@example.com>
    mailer: {
        host: 'smtp.zoho.com',
        secureConnection: true,
        port: 465, // port for secure SMTP
        requiresAuth: true,
        auth: {
            user: 'support@rest.qa',
            pass: process.env.EMAIL_PW
        }
    }
};

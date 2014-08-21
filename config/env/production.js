'use strict';

module.exports = {
    db: 'mongodb://nodejitsu:0e9ec9a4568531b973aec47184098ae5@troup.mongohq.com:10051/nodejitsudb7044928579',
    app: {
        name: 'MEAN - A Modern Stack - Production'
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
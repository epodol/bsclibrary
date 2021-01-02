const admin = require('firebase-admin');

const setRole = require('./src/setRole');

admin.initializeApp();

exports.setRole = setRole.setRole;

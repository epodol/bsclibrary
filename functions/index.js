const admin = require('firebase-admin');

const setRole = require('./src/setRole');
const setBookQueryData = require('./src/setBookQueryData');

admin.initializeApp();

exports.setRole = setRole.setRole;
exports.setBookQueryData = setBookQueryData.setBookQueryData;

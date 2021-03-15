const admin = require('firebase-admin');

const setRole = require('./src/setRole');
const setBookQueryData = require('./src/setBookQueryData');
const addNewUser = require('./src/addNewUser');

const setGenesisUser = require('./src/setGenesisUser');

admin.initializeApp();

exports.setRole = setRole.setRole;
exports.setBookQueryData = setBookQueryData.setBookQueryData;
exports.addNewUser = addNewUser.addNewUser;

exports.setGenesisUser = setGenesisUser.setGenesisUser;

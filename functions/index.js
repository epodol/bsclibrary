const admin = require('firebase-admin');

const setBookQueryData = require('./src/setBookQueryData');
const setBookCopiesData = require('./src/setBookCopiesData');

const updateUser = require('./src/updateUser');
const setRole = require('./src/setRole');
const addNewUser = require('./src/addNewUser');

const setGenesisUser = require('./src/setGenesisUser');

admin.initializeApp();

exports.setBookQueryData = setBookQueryData.setBookQueryData;
exports.setBookCopiesData = setBookCopiesData.setBookCopiesData;

exports.updateUser = updateUser.updateUser;
exports.setRole = setRole.setRole;
exports.addNewUser = addNewUser.addNewUser;

exports.setGenesisUser = setGenesisUser.setGenesisUser;

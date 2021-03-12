const admin = require('firebase-admin');

const setRole = require('./src/setRole');
const setBookQueryData = require('./src/setBookQueryData');
const addNewUser = require('./src/addNewUser');

admin.initializeApp();

exports.setRole = setRole.setRole;
exports.setBookQueryData = setBookQueryData.setBookQueryData;
exports.addNewUser = addNewUser.addNewUser;

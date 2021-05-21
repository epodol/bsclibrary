const admin = require('firebase-admin');

const setBookQueryData = require('./src/setBookQueryData');
const setBookCopiesData = require('./src/setBookCopiesData');

const updateUser = require('./src/updateUser');
const addNewUser = require('./src/addNewUser');

admin.initializeApp();

exports.setBookQueryData = setBookQueryData.setBookQueryData;
exports.setBookCopiesData = setBookCopiesData.setBookCopiesData;

exports.updateUser = updateUser.updateUser;
exports.addNewUser = addNewUser.addNewUser;

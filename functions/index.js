const admin = require('firebase-admin');

const setBookCopiesData = require('./src/setBookCopiesData');

const updateUser = require('./src/updateUser');
const addNewUser = require('./src/addNewUser');

const addBookReview = require('./src/addBookReview');

admin.initializeApp();

exports.setBookCopiesData = setBookCopiesData.setBookCopiesData;

exports.updateUser = updateUser.updateUser;
exports.addNewUser = addNewUser.addNewUser;

exports.addBookReview = addBookReview.addBookReview;

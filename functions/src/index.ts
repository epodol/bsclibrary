import * as admin from 'firebase-admin';

import addBookReview from './addBookReview';
import setBookCopiesData from './setBookCopiesData';
import checkoutBook from './checkoutBook';
import checkinBook from './checkinBook';
import updateUser from './updateUser';
import addNewUser from './addNewUser';

admin.initializeApp();

export {
  addBookReview,
  setBookCopiesData,
  checkoutBook,
  checkinBook,
  updateUser,
  addNewUser,
};

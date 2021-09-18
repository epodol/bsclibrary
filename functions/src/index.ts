import admin from 'firebase-admin';

export { default as addBookReview } from './books/addBookReview.js';
export { default as setBookCopiesData } from './books/setBookCopiesData.js';

export { default as checkoutBook } from './checkouts/checkoutBook.js';
export { default as checkinBook } from './checkouts/checkinBook.js';
export { default as renewCheckout } from './checkouts/renewCheckout.js';

export { default as updateUser } from './users/updateUser.js';
export { default as addNewUser } from './users/addNewUser.js';

admin.initializeApp();

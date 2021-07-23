/* eslint-disable import/prefer-default-export */
import * as admin from 'firebase-admin';

export { default as addBookReview } from './books/addBookReview';
export { default as setBookCopiesData } from './books/setBookCopiesData';

export { default as checkoutBook } from './checkouts/checkoutBook';
export { default as checkinBook } from './checkouts/checkinBook';
export { default as renewCheckout } from './checkouts/renewCheckout';

export { default as updateUser } from './users/updateUser';
export { default as addNewUser } from './users/addNewUser';

admin.initializeApp();

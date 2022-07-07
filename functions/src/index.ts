import { initializeApp } from 'firebase-admin/app';

initializeApp();

export { default as addBookReview } from './books/addBookReview.js';
export { default as setBookCopiesData } from './books/setBookCopiesData.js';

export { default as checkoutBook } from './checkouts/checkoutBook.js';
export { default as checkinBook } from './checkouts/checkinBook.js';
export { default as renewCheckout } from './checkouts/renewCheckout.js';

export { default as updatePermissionsClaims } from './users/updatePermissionsClaims.js';

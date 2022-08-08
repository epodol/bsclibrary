import { initializeApp } from 'firebase-admin/app';

initializeApp();

export { default as addBookReview } from './books/addBookReview.js';
export { default as copiesStatistics } from './books/copiesStatistics.js';
export { default as booksStatistics } from './books/booksStatistics.js';

export { default as checkoutBook } from './checkouts/checkoutBook.js';
export { default as checkinBook } from './checkouts/checkinBook.js';
export { default as renewCheckout } from './checkouts/renewCheckout.js';

export { default as updatePermissionsClaims } from './libraries/updatePermissionsClaims.js';

export { default as userStatistics } from './users/userStatistics.js';

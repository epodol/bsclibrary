const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.setBookQueryData = functions.firestore
  .document('books/{docId}')
  .onWrite(({ after }) => {
    if (!after.exists) return null;

    const { volumeInfo = {} } = after.data();

    if (Object.keys(volumeInfo).length < 1) return null;

    const set = {};

    const { FieldValue } = admin.firestore;

    // Title
    if (typeof volumeInfo.title !== 'undefined') {
      set.titleQuery = [];
      let curName = '';
      volumeInfo.title
        .toLowerCase()
        .split('')
        .forEach((letter) => {
          curName += letter;
          set.titleQuery.push(curName);
        });
      volumeInfo.title
        .toLowerCase()
        .split(' ')
        .forEach((item) => set.titleQuery.push(item));
      if (set.titleQuery.includes('the'))
        set.titleQuery.splice(set.titleQuery.indexOf('the'), 1);
      if (set.titleQuery.includes('and'))
        set.titleQuery.splice(set.titleQuery.indexOf('and'), 1);
      let i = 0;
      while (i < set.titleQuery.length) {
        if (
          set.titleQuery[i] === 'the' ||
          set.titleQuery[i] === 'and' ||
          set.titleQuery[i] === 'or'
        ) {
          set.titleQuery.splice(i, 1);
        } else {
          i += 1;
        }
      }
    } else if (typeof volumeInfo.titleQuery !== 'undefined')
      set.titleQuery = FieldValue.delete();

    // Authors
    if (typeof volumeInfo.authors !== 'undefined') {
      set.authorsQuery = [];
      const tempArray = volumeInfo.authors.map((item) => item.toLowerCase());
      tempArray.forEach((item) => {
        item
          .toLowerCase()
          .split(' ')
          .forEach((word) => {
            set.authorsQuery.push(word);
          });
      });
    } else if (typeof volumeInfo.authorsQuery !== 'undefined')
      set.authorsQuery = FieldValue.delete();

    // Genres
    if (typeof volumeInfo.genres !== 'undefined') {
      // set.genresQuery = volumeInfo.genres.map((v) => v.toLowerCase());
      set.genresQuery = [];
      volumeInfo.genres.map((v) =>
        v
          .toLowerCase()
          .split(' ')
          .forEach((item) => {
            set.genresQuery.push(item);
          })
      );
    } else if (typeof volumeInfo.genresQuery !== 'undefined')
      set.genresQuery = FieldValue.delete();

    if (
      JSON.stringify(volumeInfo.titleQuery) ===
        JSON.stringify(set.titleQuery) &&
      JSON.stringify(volumeInfo.authorsQuery) ===
        JSON.stringify(set.authorsQuery) &&
      JSON.stringify(volumeInfo.genresQuery) === JSON.stringify(set.genresQuery)
    ) {
      console.log('No need to change anything.');
      return null;
    }
    console.log('WRITEING ');
    return after.ref.set({ volumeInfo: set }, { merge: true });
  });

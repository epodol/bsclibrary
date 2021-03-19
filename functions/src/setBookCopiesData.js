const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.setBookCopiesData = functions.firestore
  .document('books/{bookId}/copies/{copyID}')
  .onWrite(({ before, after }) => {
    const increment = (val) => admin.firestore.FieldValue.increment(val);
    const newVal = {};

    const beforeStatus = before.exists ? before.data().status : 4;
    const afterStatus = after.exists ? after.data().status : 4;

    if (beforeStatus === afterStatus) return null;

    if (
      ((beforeStatus === 0 || beforeStatus === 1) &&
        (afterStatus === 0 || afterStatus === 1)) ||
      ((beforeStatus === 2 || beforeStatus === 3) &&
        (afterStatus === 2 || afterStatus === 3))
    )
      return null;
    if (beforeStatus === 0 || beforeStatus === 1) {
      if (afterStatus === 2 || afterStatus === 3)
        // Reduce Available -1
        newVal.copiesAvailable = increment(-1);
      if (afterStatus === 4)
        // Reduce Available -1 Reduce Count -1
        newVal.copiesCount = increment(-1);
      newVal.copiesAvailable = increment(-1);
    }
    if (beforeStatus === 2 || beforeStatus === 3) {
      if (afterStatus === 0 || afterStatus === 1)
        // Add Available +1
        newVal.copiesAvailable = increment(1);
      if (afterStatus === 4)
        // Reduce Count -1
        newVal.copiesCount = increment(-1);
    }
    if (beforeStatus === 4) {
      if (afterStatus === 0 || afterStatus === 1)
        // Add Available +1 Add Count +1
        newVal.copiesAvailable = increment(1);
      newVal.copiesCount = increment(1);
      if (afterStatus === 2 || afterStatus === 3)
        // Add Count +1
        newVal.copiesCount = increment(1);
    }

    return after.ref.parent.parent.update(newVal);
  });

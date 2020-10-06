const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
db.settings({ignoreUndefinedProperties: true})

exports.onUpdateUpdateBookSummary =
    functions.firestore.document('books/{bookId}').onUpdate(((change, context) => {

        console.log(change.after.ref.id)

        let total_copies_after;
        let available_copies_after;
        let available_copies_before;
        let total_copies_before;
        if (change.after.ref.id === 'summary') {
            return null;
        } else {

            functions.logger.info(change.after.ref.id)

            bookId = change.after.ref.id;
            if (change.after.data().copies) {
                let sum = 0;
                change.after.data().copies.forEach(copy => {
                    if (copy.available) {
                        sum = sum + 1;
                    }
                })
                available_copies_after = sum

                total_copies_after = change.after.data().copies.length
            } else {
                available_copies_after = null;
                total_copies_after = null;
            }

            if (change.before.data().copies) {
                let sum = 0;
                change.before.data().copies.forEach(copy => {
                    if (copy.available) {
                        sum = sum + 1;
                    }
                })
                available_copies_before = sum

                total_copies_before = change.before.data().copies.length
            } else {
                available_copies_before = null;
                total_copies_before = null;
            }

            let newBookInfo = {
                reference: change.after.ref,
                title: change.after.data().title,
                author: change.after.data().author,
                total_copies: total_copies_after,
                available_copies: available_copies_after
            }

            const oldBookInfo = {
                reference: change.before.ref,
                title: change.before.data().title,
                author: change.before.data().author,
                total_copies: total_copies_before,
                available_copies: available_copies_before
            }

            const batch = db.batch();

            const summaryRef = db.collection('books').doc('summary');

            batch.update(summaryRef, {books: admin.firestore.FieldValue.arrayRemove(oldBookInfo)});

            batch.update(summaryRef, {books: admin.firestore.FieldValue.arrayUnion(newBookInfo)});

            batch.update(summaryRef, {lastUpdated: admin.firestore.FieldValue.serverTimestamp()})

            return (batch.commit());
        }
    }))

exports.onCreateUpdateBookSummary =
    functions.firestore.document('books/{bookId}').onCreate(((snap, context) => {

        let total_copies_after;
        let available_copies_after;

        bookId = snap.ref.id;
        if (snap.data().copies) {
            let sum = 0;
            snap.data().copies.forEach(copy => {
                if (copy.available) {
                    sum = sum + 1;
                }
            })
            available_copies_after = sum

            total_copies_after = snap.data().copies.length
        } else {
            available_copies_after = null;
            total_copies_after = null;
        }

        let newBookInfo = {
            reference: snap.ref,
            title: snap.data().title,
            author: snap.data().author,
            total_copies: total_copies_after,
            available_copies: available_copies_after
        }

        const batch = db.batch();

        const summaryRef = db.collection('books').doc('summary');

        batch.update(summaryRef, {books: admin.firestore.FieldValue.arrayUnion(newBookInfo)});

        batch.update(summaryRef, {lastUpdated: admin.firestore.FieldValue.serverTimestamp()})

        return (batch.commit());

    }))

exports.onDeleteUpdateBookSummary =
    functions.firestore.document('books/{bookId}').onDelete(((snap, context) => {

        let total_copies_after;
        let available_copies_after;

        bookId = snap.ref.id;
        if (snap.data().copies) {
            let sum = 0;
            snap.data().copies.forEach(copy => {
                if (copy.available) {
                    sum = sum + 1;
                }
            })
            available_copies_after = sum

            total_copies_after = snap.data().copies.length
        } else {
            available_copies_after = null;
            total_copies_after = null;
        }

        let oldBookInfo = {
            reference: snap.ref,
            title: snap.data().title,
            author: snap.data().author,
            total_copies: total_copies_after,
            available_copies: available_copies_after
        }

        const batch = db.batch();

        const summaryRef = db.collection('books').doc('summary');

        batch.update(summaryRef, {books: admin.firestore.FieldValue.arrayRemove(oldBookInfo)});

        batch.update(summaryRef, {lastUpdated: admin.firestore.FieldValue.serverTimestamp()})

        return (batch.commit());

    }))
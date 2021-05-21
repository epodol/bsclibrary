const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.updateUser = functions.firestore
  .document('users/{docId}')
  .onUpdate(async ({ after, before }) => {
    const {
      email,
      phoneNumber,
      emailVerified,
      displayName,
      photoURL,
      disabled,
      role,
      firstName,
      lastName,
      permissions,
      createdBy,
      createdTime,
      editedBy,
      editedTime,
    } = after.data().userInfo;

    const beforeUserInfo = before.data().userInfo;

    if (beforeUserInfo.email !== email)
      await admin
        .auth()
        .updateUser(after.id, {
          email,
        })
        // eslint-disable-next-line handle-callback-err
        .catch(async (err) => {
          console.log(err.errorInfo);
          if (
            err.errorInfo.code === 'auth/email-already-exists' ||
            err.errorInfo.code === 'auth/invalid-email'
          )
            await admin
              .firestore()
              .collection('users')
              .doc(after.id)
              .set(
                {
                  userInfo: {
                    email: beforeUserInfo.email,
                  },
                },
                { merge: true }
              );
        });

    if (beforeUserInfo.phoneNumber !== phoneNumber)
      await admin
        .auth()
        .updateUser(after.id, {
          phoneNumber,
        })
        .catch((err) => {
          console.log(err);
        });

    await admin.auth().updateUser(after.id, {
      emailVerified,
      displayName,
      photoURL,
      disabled,
    });

    await admin
      .firestore()
      .collection('users')
      .doc(after.id)
      .set(
        {
          userInfo: {
            queryEmail: email.toLowerCase(),
            queryFirstName: firstName ? firstName.toLowerCase() : null,
            queryLastName: lastName ? lastName.toLowerCase() : null,
          },
        },
        { merge: true }
      );

    return admin.auth().setCustomUserClaims(after.id, {
      role,
      firstName,
      lastName,
      permissions,
      createdBy,
      createdTime,
      editedBy,
      editedTime,
    });
  });

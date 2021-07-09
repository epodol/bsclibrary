import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import User from '@common/types/User';

const updateUser = functions
  .region('us-west2')
  .firestore.document('users/{docId}')
  .onUpdate(async ({ before, after }) => {
    const afterData: User = after.data();

    const beforeUser: User = before.data().userInfo;

    if (beforeUser?.userInfo?.email !== afterData.userInfo?.email)
      await admin
        .auth()
        .updateUser(after.id, {
          email: afterData.userInfo?.email,
        })
        .catch(async (err) => {
          console.error(err.errorInfo);
          if (
            err.errorInfo.code === 'auth/email-already-exists' ||
            err.errorInfo.code === 'auth/invalid-email'
          ) {
            const userDoc: User = {
              userInfo: {
                email: beforeUser?.userInfo?.email,
              },
            };
            await admin
              .firestore()
              .collection('users')
              .doc(after.id)
              .set(userDoc, { merge: true });
          }
        });

    if (beforeUser?.userInfo?.phoneNumber !== afterData.userInfo?.phoneNumber)
      await admin
        .auth()
        .updateUser(after.id, {
          phoneNumber: afterData.userInfo?.phoneNumber,
        })
        .catch((err) => {
          console.error(err);
        });

    await admin.auth().updateUser(after.id, {
      displayName: afterData.userInfo?.displayName,
      photoURL: afterData.userInfo?.photoURL,
      disabled: afterData.userInfo?.disabled,
    });

    const userDoc: User = {
      userInfo: {
        queryEmail: afterData.userInfo?.email?.toLowerCase(),
        queryFirstName: afterData.userInfo?.firstName?.toLowerCase() ?? null,
        queryLastName: afterData.userInfo?.lastName?.toLowerCase() ?? null,
      },
    };

    await admin
      .firestore()
      .collection('users')
      .doc(after.id)
      .set(userDoc, { merge: true });

    return admin.auth().setCustomUserClaims(after.id, {
      role: afterData.userInfo?.role,
      firstName: afterData.userInfo?.firstName,
      lastName: afterData.userInfo?.lastName,
      permissions: afterData.userInfo?.permissions,
      createdBy: afterData.userInfo?.createdBy,
      createdTime: afterData.userInfo?.createdTime,
      editedBy: afterData.userInfo?.editedBy,
      editedTime: afterData.userInfo?.editedTime,
    });
  });

export default updateUser;

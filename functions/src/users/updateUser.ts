import functions from 'firebase-functions';
import admin from 'firebase-admin';
import User from '@common/types/User';
import RecursivePartial from '@common/types/RecursivePartial';

const updateUser = functions
  .region('us-west2')
  .firestore.document('users/{docId}')
  .onUpdate(async ({ before, after }) => {
    const afterData: User = after.data() as User;

    const beforeUser: User = before.data() as User;

    // Update email if it has changed
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
            const userDoc: RecursivePartial<User> = {
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

    // Update phone number if it has changed
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

    const userDoc: RecursivePartial<User> = {
      userInfo: {
        queryEmail: afterData.userInfo?.email?.toLowerCase(),
        queryFirstName: afterData.userInfo?.firstName?.toLowerCase() ?? null,
        queryLastName: afterData.userInfo?.lastName?.toLowerCase() ?? null,
      },
    };
    // Only update query info if it has changed
    if (
      beforeUser?.userInfo?.queryEmail !== userDoc.userInfo?.queryEmail ||
      beforeUser?.userInfo?.queryFirstName !==
        userDoc.userInfo?.queryFirstName ||
      beforeUser?.userInfo?.queryLastName !== userDoc.userInfo?.queryLastName
    ) {
      await admin
        .firestore()
        .collection('users')
        .doc(after.id)
        .set(userDoc, { merge: true });
    }

    // Update the user's custom claims
    return admin.auth().setCustomUserClaims(after.id, {
      role: afterData.userInfo?.role,
      firstName: afterData.userInfo?.firstName,
      lastName: afterData.userInfo?.lastName,
      permissions: afterData.userInfo?.permissions,
      checkoutInfo: afterData.checkoutInfo,
    });
  });

export default updateUser;

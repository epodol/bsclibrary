import functions from 'firebase-functions';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import User from '@common/types/User';
import RecursivePartial from '@common/types/util/RecursivePartial';

const updateUser = functions
  .region('us-west2')
  .firestore.document('users/{docId}')
  .onUpdate(async ({ before, after }) => {
    const auth = getAuth();
    const firestore = getFirestore();

    const afterData: User = after.data() as User;

    const beforeUser: User = before.data() as User;

    // Update email if it has changed
    if (beforeUser?.userInfo?.email !== afterData.userInfo?.email)
      await auth
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
            await firestore
              .collection('users')
              .doc(after.id)
              .set(userDoc, { merge: true });
          }
        });

    // Update phone number if it has changed
    if (beforeUser?.userInfo?.phoneNumber !== afterData.userInfo?.phoneNumber)
      await auth
        .updateUser(after.id, {
          phoneNumber: afterData.userInfo?.phoneNumber,
        })
        .catch((err) => {
          console.error(err);
        });

    await auth.updateUser(after.id, {
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
      await firestore
        .collection('users')
        .doc(after.id)
        .set(userDoc, { merge: true });
    }

    // Update the user's custom claims
    return auth.setCustomUserClaims(after.id, {
      firstName: afterData.userInfo?.firstName,
      lastName: afterData.userInfo?.lastName,
      permissions: afterData.userInfo?.permissions,
      checkoutInfo: afterData.checkoutInfo,
    });
  });

export default updateUser;

import functions from 'firebase-functions';
import Library from '@common/types/Library';
import { getAuth } from 'firebase-admin/auth';

const updatePermissionsClaims = functions
  .region('us-west2')
  .firestore.document('libraries/{library}')
  .onWrite(async ({ before, after }) => {
    const beforeData = before.data() as Library | undefined;
    const afterData = after.data() as Library | undefined;
    if (beforeData && afterData) {
      // Library updated
      console.log('Library updated');
    }
    if (!beforeData && afterData) {
      // Library created
      console.log('Library created');
    }
    if (beforeData && !afterData) {
      // Library deleted
      console.log('Library deleted');
      const beforePermissions = Object.entries(beforeData.userPermissions);

      beforePermissions.forEach(async (permission) => {
        for (
          let permissionPointer = 0;
          permissionPointer < beforePermissions.length;
          permissionPointer += 1
        ) {
          const users = permission[1][permissionPointer];

          // permission[1].forEach(async (users) => {
          // Loop over each user
          for (
            let userPointer = 0;
            userPointer < users.length;
            userPointer += 1
          ) {
            const user = users[userPointer];
            console.log(
              `Deleting permission ${permission[0]} for user ${user}`
            );
            // eslint-disable-next-line no-await-in-loop
            const userClaims = (await getAuth().getUser(user)).customClaims;
          }
        }
      });
    }
  });

export default updatePermissionsClaims;

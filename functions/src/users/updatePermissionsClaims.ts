import functions from 'firebase-functions';
import Library from '@common/types/Library';

const updatePermissionsClaims = functions
  .region('us-west2')
  .firestore.document('libraries/{library}')
  .onWrite(({ before, after }) => {
    const beforeData = before.data() as Library | undefined;
    const afterData = after.data() as Library | undefined;
    if (beforeData && afterData) {
      // User updated
      console.log('User created');
    }
    if (!beforeData && afterData) {
      // User created
      console.log('User created');
    }
    if (beforeData && !afterData) {
      // User deleted
      console.log('User deleted');
    }
  });

export default updatePermissionsClaims;

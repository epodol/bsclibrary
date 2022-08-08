import functions from 'firebase-functions';
import Library, { UserPermissions } from '@common/types/Library';
import { getAuth } from 'firebase-admin/auth';

interface permissionChange {
  [user: string]: string[];
}

const updatePermissionsClaims = functions
  .region('us-west2')
  .firestore.document('libraries/{library}')
  .onWrite(async ({ before, after }, context) => {
    const beforeData = before.data() as Library | undefined;
    const afterData = after.data() as Library | undefined;

    const libraryID = context.params.library;

    const permissionsToAdd: permissionChange = {};
    const permissionsToRemove: permissionChange = {};

    // Library updated
    if (beforeData && afterData) {
      // Fallback
      // @ts-ignore
      if (!beforeData.userPermissions) beforeData.userPermissions = {};
      // Fallback
      // @ts-ignore
      if (!afterData.userPermissions) afterData.userPermissions = {};
      Object.keys(beforeData.userPermissions)
        .concat(
          Object.keys(afterData.userPermissions).filter(
            (item) => Object.keys(beforeData.userPermissions).indexOf(item) < 0
          )
        )
        .forEach((permission) => {
          const beforeUsersWithPermission = Array.isArray(
            beforeData.userPermissions[permission as keyof UserPermissions]
          )
            ? beforeData.userPermissions[permission as keyof UserPermissions]
            : [];
          const afterUsersWithPermission = Array.isArray(
            afterData.userPermissions[permission as keyof UserPermissions]
          )
            ? afterData.userPermissions[permission as keyof UserPermissions]
            : [];

          // Find the elements added from beforePermissions to afterPermissions
          afterUsersWithPermission
            .filter(
              (afterPermission) =>
                !beforeUsersWithPermission.includes(afterPermission)
            )
            .forEach((user) => {
              if (Array.isArray(permissionsToAdd[user])) {
                permissionsToAdd[user].push(permission);
              } else {
                permissionsToAdd[user] = [permission];
              }
            });

          // Find the elements removed from beforePermissions to afterPermissions
          beforeUsersWithPermission
            .filter(
              (beforePermission) =>
                !afterUsersWithPermission.includes(beforePermission)
            )
            .forEach((user) => {
              if (Array.isArray(permissionsToRemove[user])) {
                permissionsToRemove[user].push(permission);
              } else {
                permissionsToRemove[user] = [permission];
              }
            });
        });

      // Update the owner of the library if it has changed
      if (beforeData.ownerUserID !== afterData.ownerUserID) {
        const oldOwnerUser = await getAuth()
          .getUser(beforeData.ownerUserID)
          .catch(console.warn);
        const newOwnerUser = await getAuth()
          .getUser(afterData.ownerUserID)
          .catch(console.warn);

        if (newOwnerUser) {
          const newLibrariesOwned = [];

          if (
            newOwnerUser?.customClaims?.librariesOwned &&
            Array.isArray(newOwnerUser?.customClaims?.librariesOwned)
          )
            newLibrariesOwned.push(...newOwnerUser.customClaims.librariesOwned);

          if (!newLibrariesOwned.includes(libraryID))
            newLibrariesOwned.push(libraryID);

          getAuth().setCustomUserClaims(newOwnerUser.uid, {
            ...newOwnerUser?.customClaims,
            librariesOwned: newLibrariesOwned,
          });
        }

        if (
          newOwnerUser &&
          oldOwnerUser &&
          oldOwnerUser?.customClaims &&
          Array.isArray(oldOwnerUser?.customClaims?.librariesOwned)
        ) {
          const newLibrariesOwned =
            oldOwnerUser.customClaims.librariesOwned.filter(
              (library: string) => library !== libraryID
            );

          getAuth().setCustomUserClaims(oldOwnerUser.uid, {
            ...oldOwnerUser?.customClaims,
            librariesOwned: newLibrariesOwned,
          });
        }

        if (!newOwnerUser && oldOwnerUser) {
          console.error(
            'Error updating owner of library. Resetting to prior.',
            oldOwnerUser,
            newOwnerUser
          );

          const updatedDoc: Partial<Library> = {
            ownerUserID: beforeData.ownerUserID,
          };

          await after.ref.update(updatedDoc);
        }
      }
    }

    // Library created
    if (!beforeData && afterData) {
      if (afterData.userPermissions) {
        Object.keys(afterData.userPermissions).forEach((permission) => {
          const usersWithPermission =
            afterData.userPermissions[permission as keyof UserPermissions];

          usersWithPermission.forEach((user) => {
            if (Array.isArray(permissionsToAdd[user])) {
              permissionsToAdd[user].push(permission);
            } else {
              permissionsToAdd[user] = [permission];
            }
          });
        });
      }
      if (afterData.ownerUserID) {
        const newOwnerUser = await getAuth().getUser(afterData.ownerUserID);
        const newLibrariesOwned = [];

        if (
          newOwnerUser?.customClaims?.librariesOwned &&
          Array.isArray(newOwnerUser?.customClaims?.librariesOwned)
        )
          newLibrariesOwned.push(...newOwnerUser.customClaims.librariesOwned);

        if (!newLibrariesOwned.includes(libraryID))
          newLibrariesOwned.push(libraryID);

        getAuth().setCustomUserClaims(newOwnerUser.uid, {
          ...newOwnerUser?.customClaims,
          librariesOwned: newLibrariesOwned,
        });
      }
    }

    // Library deleted
    if (beforeData && !afterData) {
      if (beforeData.userPermissions) {
        Object.keys(beforeData.userPermissions).forEach((permission) => {
          const usersWithPermission =
            beforeData.userPermissions[permission as keyof UserPermissions];

          usersWithPermission.forEach((user) => {
            if (Array.isArray(permissionsToRemove[user])) {
              permissionsToRemove[user].push(permission);
            } else {
              permissionsToRemove[user] = [permission];
            }
          });
        });
      }
      if (beforeData.ownerUserID) {
        const oldOwnerUser = await getAuth().getUser(beforeData.ownerUserID);
        if (
          oldOwnerUser &&
          oldOwnerUser?.customClaims?.librariesOwned &&
          Array.isArray(oldOwnerUser?.customClaims?.librariesOwned)
        ) {
          const newLibrariesOwned =
            oldOwnerUser.customClaims.librariesOwned.filter(
              (library: string) => library !== libraryID
            );

          getAuth().setCustomUserClaims(oldOwnerUser.uid, {
            ...oldOwnerUser?.customClaims,
            librariesOwned: newLibrariesOwned,
          });
        }
      }
    }

    // Remove permissions
    Object.keys(permissionsToRemove).forEach(async (user) => {
      const userClaims = (await getAuth().getUser(user).catch(console.error))
        ?.customClaims;

      if (userClaims) {
        permissionsToRemove[user].forEach((permissionToRemove) => {
          if (Array.isArray(userClaims?.permissions[permissionToRemove])) {
            userClaims.permissions[permissionToRemove] = userClaims.permissions[
              permissionToRemove
            ].filter((item: string) => item !== libraryID);
            if (userClaims.permissions[permissionToRemove].length === 0) {
              delete userClaims.permissions[permissionToRemove];
            }
          } else
            console.error(
              'Error removing permission.',
              user,
              permissionToRemove,
              libraryID,
              userClaims
            );
        });

        getAuth().setCustomUserClaims(user, userClaims).catch(console.error);
      }
    });

    // Add permissions
    Object.keys(permissionsToAdd).forEach(async (user) => {
      const userClaims = (await getAuth().getUser(user).catch(console.error))
        ?.customClaims;

      const newClaims: any = { permissions: {} };

      permissionsToAdd[user].forEach((permissionToAdd) => {
        if (
          userClaims &&
          Array.isArray(userClaims?.permissions?.[permissionToAdd])
        ) {
          const updatedClaims = userClaims.permissions[permissionToAdd];
          updatedClaims.push(libraryID);
          newClaims.permissions[permissionToAdd] = updatedClaims;
        } else {
          newClaims.permissions[permissionToAdd] = [libraryID];
        }
      });

      getAuth()
        .setCustomUserClaims(user, {
          ...userClaims,
          permissions: {
            ...userClaims?.permissions,
            ...newClaims.permissions,
          },
        })
        .catch(console.error);
    });
  });

export default updatePermissionsClaims;

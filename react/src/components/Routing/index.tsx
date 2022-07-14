import React, { lazy, Suspense, useContext, useEffect } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';

import {
  useFirebaseApp,
  useFirestore,
  useFirestoreDocData,
  useUser,
} from 'reactfire';
import { getAnalytics, logEvent } from 'firebase/analytics';

import Loading from 'src/components/Loading';

import NotificationContext from 'src/contexts/NotificationContext';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';
import { doc } from 'firebase/firestore';
import Library from '@common/types/Library';
import Layout from 'src/components/Layout';
import User from '@common/types/User';
import About from 'src/pages/CustomPage/About';
import Contribute from 'src/pages/CustomPage/Contribute';

const LibraryHome = lazy(() => import('src/pages/LibraryHome'));
const JoinLibrary = lazy(() => import('src/pages/JoinLibrary'));
const Account = lazy(() => import('src/pages/Account'));
const Users = lazy(() => import('src/pages/Users'));
const DisplayUser = lazy(() => import('src/pages/Users/DisplayUser'));
const Books = lazy(() => import('src/pages/Books'));
const DisplayBook = lazy(() => import('src/pages/Books/DisplayBook'));
const CheckOut = lazy(() => import('src/pages/CheckOut'));
const CheckIn = lazy(() => import('src/pages/CheckIn'));
const CheckOuts = lazy(() => import('src/pages/CheckOuts'));
const CheckOutDialog = lazy(() => import('src/pages/CheckOuts/CheckoutDialog'));

const isDev = process.env.NODE_ENV !== 'production';

const Page = ({ title, children }: { title: string; children: any }) => {
  const app = useFirebaseApp();
  const location = useLocation();
  useEffect(() => {
    if (!isDev) {
      const analytics = getAnalytics(app);
      logEvent(analytics, 'page_view', { page_location: location.pathname });
    }
    document.title = title;
    return () => {
      document.title = 'BASIS Scottsdale Library';
    };
  }, [title, app, location.pathname]);
  return children;
};

const Routing = () => {
  const NotificationHandler = useContext(NotificationContext);
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');

  const user = useUser().data;
  if (!user) throw new Error('No user signed in!');

  const firestore = useFirestore();

  const libraryDoc: Library = useFirestoreDocData(
    doc(firestore, 'libraries', activeLibraryID)
  ).data as Library;

  const userDoc: User = useFirestoreDocData(
    doc(firestore, 'libraries', activeLibraryID, 'users', user.uid)
  ).data as User;

  const UnknownPage = () => {
    useEffect(() => {
      NotificationHandler.addNotification({
        message: 'The page you are looking for does not exist.',
        severity: 'warning',
        timeout: 10000,
        position: {
          horizontal: 'center',
          vertical: 'top',
        },
      });
      console.warn('The page you are looking for does not exist.');
    }, []);
    return <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              userDoc ? (
                <Page title="BASIS Scottsdale Library">
                  <LibraryHome />
                </Page>
              ) : (
                <Page title="Join - BASIS Scottsdale Library">
                  <JoinLibrary />
                </Page>
              )
            }
          />
          <Route
            path="about"
            element={
              <Suspense fallback={<Loading />}>
                <Page title="About - BASIS Scottsdale Library">
                  <About />
                </Page>
              </Suspense>
            }
          />
          <Route
            path="contribute"
            element={
              <Suspense fallback={<Loading />}>
                <Page title="Contribute - BASIS Scottsdale Library">
                  <Contribute />
                </Page>
              </Suspense>
            }
          />
          <Route
            path="account"
            element={
              userDoc ? (
                <Page title="Account - BASIS Scottsdale Library">
                  <Account />
                </Page>
              ) : (
                <Page title="Join - BASIS Scottsdale Library">
                  <JoinLibrary />
                </Page>
              )
            }
          />
          {userDoc && (
            <>
              <Route
                path="books"
                element={
                  <Suspense fallback={<Loading />}>
                    <Page title="Books - BASIS Scottsdale Library">
                      <Books />
                    </Page>
                  </Suspense>
                }
              />
              <Route
                path="books/:id"
                element={
                  <Suspense fallback={<Loading />}>
                    <Page title="View Book - BASIS Scottsdale Library">
                      <DisplayBook />
                    </Page>
                  </Suspense>
                }
              />
              {(libraryDoc.userPermissions.CHECK_OUT.includes(user.uid) ||
                libraryDoc.ownerUserID === user.uid) && (
                <Route
                  path="checkout"
                  element={
                    <Suspense fallback={<Loading />}>
                      <Page title="Check Out - BASIS Scottsdale Library">
                        <CheckOut />
                      </Page>
                    </Suspense>
                  }
                />
              )}
              {(libraryDoc.userPermissions.CHECK_IN.includes(user.uid) ||
                libraryDoc.ownerUserID === user.uid) && (
                <Route
                  path="checkin"
                  element={
                    <Suspense fallback={<Loading />}>
                      <Page title="Check In - BASIS Scottsdale Library">
                        <CheckIn />
                      </Page>
                    </Suspense>
                  }
                />
              )}
              {(libraryDoc.userPermissions.MANAGE_CHECKOUTS.includes(
                user.uid
              ) ||
                libraryDoc.ownerUserID === user.uid) && (
                <>
                  <Route
                    path="checkouts"
                    element={
                      <Suspense fallback={<Loading />}>
                        <Page title="Manage Checkouts - BASIS Scottsdale Library">
                          <CheckOuts />
                        </Page>
                      </Suspense>
                    }
                  />
                  <Route
                    path="checkouts/:id"
                    element={
                      <Suspense fallback={<Loading />}>
                        <Page title="Manage Checkouts - BASIS Scottsdale Library">
                          <CheckOutDialog />
                        </Page>
                      </Suspense>
                    }
                  />
                </>
              )}
              {(libraryDoc.userPermissions.MANAGE_USERS.includes(user.uid) ||
                libraryDoc.ownerUserID === user.uid) && (
                <>
                  <Route
                    path="users"
                    element={
                      <Suspense fallback={<Loading />}>
                        <Page title="Users Checkouts - BASIS Scottsdale Library">
                          <Users />
                        </Page>
                      </Suspense>
                    }
                  />
                  <Route
                    path="users/:id"
                    element={
                      <Suspense fallback={<Loading />}>
                        <Page title="Display User - BASIS Scottsdale Library">
                          <DisplayUser />
                        </Page>
                      </Suspense>
                    }
                  />
                </>
              )}
            </>
          )}
          <Route path="/signin" element={<Navigate to="/" />} />
          <Route path="/create-account" element={<Navigate to="/" />} />
          <Route path="*" element={<UnknownPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;

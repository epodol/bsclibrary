import React, { lazy, useContext, useEffect } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { useFirebaseApp } from 'reactfire';
import { getAnalytics, logEvent } from 'firebase/analytics';

import NotificationContext from 'src/contexts/NotificationContext';
import Footer from 'src/components/Footer';
import About from 'src/pages/CustomPage/About';
import Contribute from 'src/pages/CustomPage/Contribute';
import SignIn from 'src/pages/SignIn';
import CreateAccount from 'src/pages/CreateAccount';

// const Home = lazy(() => import('src/pages/Home'));
const LibraryNavigation = lazy(
  () => import('src/components/LibraryNavigation')
);
const LibraryHome = lazy(() => import('src/pages/LibraryHome'));

const isDev = process.env.NODE_ENV !== 'production';

const DocumentTitle = ({
  title,
  children,
}: {
  title: string;
  children: any;
}) => {
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

const HomeRouting = () => {
  const NotificationHandler = useContext(NotificationContext);

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
    <div className="page">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <DocumentTitle title="BASIS Scottsdale Library">
                <div className="page">
                  <LibraryNavigation />
                  <main>
                    <div className="content">
                      {/* <Home /> */}
                      <LibraryHome />
                    </div>
                  </main>
                  <Footer />
                </div>
              </DocumentTitle>
            }
          />
          <Route
            path="/signin"
            element={
              <DocumentTitle title="Sign In - BASIS Scottsdale Library">
                <div className="page">
                  <LibraryNavigation />
                  <main>
                    <div className="content">
                      <SignIn />
                    </div>
                  </main>
                  <Footer />
                </div>
              </DocumentTitle>
            }
          />
          <Route
            path="/createaccount"
            element={
              <DocumentTitle title="Sign Up - BASIS Scottsdale Library">
                <div className="page">
                  <LibraryNavigation />
                  <main>
                    <div className="content">
                      <CreateAccount />
                    </div>
                  </main>
                  <Footer />
                </div>
              </DocumentTitle>
            }
          />
          <Route
            path="/about"
            element={
              <DocumentTitle title="About - BASIS Scottsdale Library">
                <div className="page">
                  <LibraryNavigation />
                  <main>
                    <div className="content">
                      <About />
                    </div>
                  </main>
                  <Footer />
                </div>
              </DocumentTitle>
            }
          />
          <Route
            path="/contribute"
            element={
              <DocumentTitle title="Contribute - BASIS Scottsdale Library">
                <div className="page">
                  <LibraryNavigation />
                  <main>
                    <div className="content">
                      <Contribute />
                    </div>
                  </main>
                  <Footer />
                </div>
              </DocumentTitle>
            }
          />
          <Route path="*" element={<UnknownPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default HomeRouting;

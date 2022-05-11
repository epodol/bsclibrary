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

import Navigation from 'src/components/Navigation';
import NotificationContext from 'src/contexts/NotificationContext';

const Home = lazy(() => import('src/pages/Home'));

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
      document.title = 'Modern Library Management System';
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
        <Navigation />
        <Routes>
          <Route
            path="/"
            element={
              <DocumentTitle title="BASIS Scottsdale Library">
                <Home />
              </DocumentTitle>
            }
          />
          <Route element={<UnknownPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default HomeRouting;

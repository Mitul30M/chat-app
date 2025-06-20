import './App.css';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Auth from './pages/auth';
import Profile from './pages/profile';
import Chat from './pages/chats';
import { action as authAction } from './pages/auth';
import { useAppStore } from './store';
import { useEffect, useState } from 'react';
import Loader from './components/ui/loader';
import api from './lib/api';
import { USER_PROFILE } from './utils/constants';
import PrivateRoute from './components/routes/PrivateRoute'; // Import the PrivateRoute component
import { ThemeProvider } from './components/theme-provider/ThemeProvider';


function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile on initial load
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await api.get(USER_PROFILE, {
          withCredentials: true,  // Ensure cookies are sent
        });
        if (response.status === 200 && response.data) {
          console.log('response :', response.data);
          setUserInfo(response.data);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setUserInfo(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();
  }, []);

  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  }

  const router = createBrowserRouter([
    {
      path: '/auth',
      element: !userInfo ? <Auth /> : <Navigate to="/chats" />,
      action: authAction,
    },
    {
      path: '/profile',
      element: <PrivateRoute redirectTo="/auth" />,
      children: [
        {
          path: '',
          element: <Profile />,
        },
      ],
    },
    {
      path: '/chats',
      element: <PrivateRoute redirectTo="/auth" />,
      children: [
        {
          path: '',
          element: <Chat />,
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to='/auth' />,
    }
  ]);

  return (


    <ThemeProvider defaultTheme='dark' storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>


  )
}

export default App;

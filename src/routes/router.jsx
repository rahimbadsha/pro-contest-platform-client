import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import PrivateRoute from '../components/PrivateRoute';
import AdminRoute from '../components/AdminRoute';
import CreatorRoute from '../components/CreatorRoute';

import Home from '../pages/Home/Home';
import AllContests from '../pages/AllContests/AllContests';
import ContestDetails from '../pages/ContestDetails/ContestDetails';
import Leaderboard from '../pages/Leaderboard/Leaderboard';
import About from '../pages/About/About';
import HowItWorks from '../pages/HowItWorks/HowItWorks';
import NotFound from '../pages/NotFound/NotFound';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import PaymentSuccess from '../pages/PaymentSuccess/PaymentSuccess';

// User dashboard
import UserOverview from '../pages/Dashboard/User/UserOverview';
import ParticipatedContests from '../pages/Dashboard/User/ParticipatedContests';
import WonContests from '../pages/Dashboard/User/WonContests';
import UserProfile from '../pages/Dashboard/User/UserProfile';

// Creator dashboard
import CreatorOverview from '../pages/Dashboard/Creator/CreatorOverview';
import AddContest from '../pages/Dashboard/Creator/AddContest';
import MyContests from '../pages/Dashboard/Creator/MyContests';
import ContestSubmissions from '../pages/Dashboard/Creator/ContestSubmissions';

// Admin dashboard
import AdminOverview from '../pages/Dashboard/Admin/AdminOverview';
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers';
import ManageContests from '../pages/Dashboard/Admin/ManageContests';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'contests', element: <AllContests /> },
      { path: 'contests/:slug', element: <ContestDetails /> },
      { path: 'leaderboard', element: <Leaderboard /> },
      { path: 'about', element: <About /> },
      { path: 'how-it-works', element: <HowItWorks /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      {
        path: 'payment-success',
        element: <PrivateRoute><PaymentSuccess /></PrivateRoute>,
      },
    ],
  },
  {
    path: '/dashboard/user',
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      { index: true, element: <UserOverview /> },
      { path: 'participated', element: <ParticipatedContests /> },
      { path: 'won', element: <WonContests /> },
      { path: 'profile', element: <UserProfile /> },
    ],
  },
  {
    path: '/dashboard/creator',
    element: <CreatorRoute><DashboardLayout /></CreatorRoute>,
    children: [
      { index: true, element: <CreatorOverview /> },
      { path: 'add-contest', element: <AddContest /> },
      { path: 'my-contests', element: <MyContests /> },
      { path: 'submissions/:contestId', element: <ContestSubmissions /> },
    ],
  },
  {
    path: '/dashboard/admin',
    element: <AdminRoute><DashboardLayout /></AdminRoute>,
    children: [
      { index: true, element: <AdminOverview /> },
      { path: 'users', element: <ManageUsers /> },
      { path: 'contests', element: <ManageContests /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

export default router;

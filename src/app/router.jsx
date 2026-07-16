import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppShell from './AppShell'
import DashboardPage from '../features/dashboard/DashboardPage'
import ProfilePage from '../features/profile/ProfilePage'
import UpdateProfilePage from '../features/profile/UpdateProfilePage'
import ChangePasswordPage from '../features/profile/ChangePasswordPage'
import IndividualOnboardingPage from '../features/deep-link/IndividualOnboardingPage'
import CompanyOnboardingPage from '../features/deep-link/CompanyOnboardingPage'
import SelfServiceLayout from '../features/self-service/SelfServiceLayout'
import IndividualOnboardingFlow from '../features/self-service/IndividualOnboardingFlow'
import CompanyOnboardingFlow from '../features/self-service/CompanyOnboardingFlow'
import LoginPage from '../features/auth/LoginPage'
import RegisterPage from '../features/auth/RegisterPage'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/app',
    element: <AppShell />,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'profile/update', element: <UpdateProfilePage /> },
      { path: 'profile/change-password', element: <ChangePasswordPage /> },
      { path: 'deep-link/individual', element: <IndividualOnboardingPage /> },
      { path: 'deep-link/company', element: <CompanyOnboardingPage /> },
      {
        path: 'self-service',
        element: <SelfServiceLayout />,
        children: [
          { path: 'individual', element: <IndividualOnboardingFlow /> },
          { path: 'company', element: <CompanyOnboardingFlow /> },
          { path: '', element: <Navigate to="individual" replace /> },
        ],
      },
      { path: '', element: <Navigate to="dashboard" replace /> },
    ],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
])

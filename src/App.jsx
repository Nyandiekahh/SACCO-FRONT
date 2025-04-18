import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';

// Auth Pages
import Login from './pages/auth/Login';
import OTPLogin from './pages/auth/OTPLogin';
import CompleteRegistration from './pages/auth/CompleteRegistration';
import PasswordResetRequest from './pages/auth/PasswordResetRequest';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyOTP from './pages/auth/VerifyOTP';

// Member Pages
import MemberDashboard from './pages/member/Dashboard';
import MemberContributions from './pages/member/Contributions';
import MemberLoanApplication from './pages/member/LoanApplication';
import MemberProfile from './pages/member/Profile';
// import MemberShareCapital from './pages/member/ShareCapital';
import MemberDocuments from './pages/member/Documents';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminMembers from './pages/admin/Members';
import AdminLoans from './pages/admin/Loans';
import AdminContributions from './pages/admin/Contributions';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';
import AdminTransactions from './pages/admin/Transactions';

// New Admin Component
import MemberDetail from './pages/admin/members/MemberDetail';

// Redirect component based on user role or authentication status
const RootRedirect = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  return currentUser.role === 'ADMIN' 
    ? <Navigate to="/admin/dashboard" replace />
    : <Navigate to="/member/dashboard" replace />;
};

// Wrapper to provide navigate to AuthProvider
const AuthProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();
  return <AuthProvider navigate={navigate}>{children}</AuthProvider>;
};

// App with router outside AuthProvider, but routes inside AuthProviderWithNavigate
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AppWithAuth />} />
      </Routes>
    </BrowserRouter>
  );
};

// This component contains all routes and is wrapped with AuthProvider that has navigate
const AppWithAuth = () => {
  const navigate = useNavigate();
  
  return (
    <AuthProvider navigate={navigate}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/otp-login" element={<OTPLogin />} />
        <Route path="/auth/complete-registration" element={<CompleteRegistration />} />
        <Route path="/auth/password-reset-request" element={<PasswordResetRequest />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/auth/verify-otp" element={<VerifyOTP />} />

        {/* Root Redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Member Routes */}
        <Route 
          path="/member/*" 
          element={
            <PrivateRoute allowedRoles={['MEMBER']}>
              <Routes>
                <Route path="dashboard" element={<MemberDashboard />} />
                <Route path="contributions" element={<MemberContributions />} />
                <Route path="loan-application" element={<MemberLoanApplication />} />
                <Route path="profile" element={<MemberProfile />} />
                {/* <Route path="share-capital" element={<MemberShareCapital />} /> */}
                <Route path="documents" element={<MemberDocuments />} />
                <Route path="" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </PrivateRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin/*" 
          element={
            <AdminRoute>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="members" element={<AdminMembers />} />
                <Route path="members/:memberId" element={<MemberDetail />} />
                <Route path="loans" element={<AdminLoans />} />
                <Route path="contributions" element={<AdminContributions />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="" element={<Navigate to="dashboard" replace />} />
                <Route path="transactions" element={<AdminTransactions />} />
              </Routes>
            </AdminRoute>
          } 
        />

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
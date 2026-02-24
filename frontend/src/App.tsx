import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Members from './pages/Members/Members';
import Finance from './pages/Finance/Finance';
import Welfare from './pages/Welfare/Welfare';
import Children from './pages/Children/Children';
import Users from './pages/Users/Users';
import type { JSX } from 'react/jsx-dev-runtime';

// A simple component to protect routes
// If no token exists, kick them back to Login
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('user_token');
    return token ? children : <Navigate to="/" />;
};
  
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route 1: The Login Page */}
        <Route path="/" element={<Login />} />

        {/* Route 2: The Dashboard (Protected) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        {/* Route 3: Members Page (Protected) */}
        <Route 
          path="/members" 
          element={
            <ProtectedRoute>
              <Members />
            </ProtectedRoute>
          } 
        />
        {/* Route 4: Finance Page (Protected) */}
        <Route 
          path="/finance" 
          element={
            <ProtectedRoute>
              <Finance />
            </ProtectedRoute>
          } 
        />
        {/* Route 5: Welfare Page (Protected) */}
        <Route 
          path="/welfare" 
          element={
            <ProtectedRoute>
              <Welfare />
            </ProtectedRoute>
          } 
        />
        {/* Route 6: Children Page (Protected) */}
        <Route 
          path="/children" 
          element={
            <ProtectedRoute>
              <Children />
            </ProtectedRoute>
          } 
        />
        {/* Route 7: Users Page (Protected) */}
        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
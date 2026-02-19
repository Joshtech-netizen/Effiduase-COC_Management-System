import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
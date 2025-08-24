import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import DashboardPage from "./pages/DashboardPage"
import LandingPage from "./pages/LandingPage"
import NotFoundPage from "./pages/NotFoundPage";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};


function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          } 
        />

        <Route 
          path="/dashboard" 
          element={
            <PublicRoute>
              <DashboardPage />
            </PublicRoute>
          } 
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App

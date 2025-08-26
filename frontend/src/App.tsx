import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import DashboardPage from "./pages/DashboardPage"
import LandingPage from "./pages/LandingPage"
import NotFoundPage from "./pages/NotFoundPage";
import AuthPage from "./pages/AuthPage";
import ProjectsPage from "./pages/ProjectsPage";
import ActivityPage from "./pages/ActivityPage";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  return isAuthenticated ? children : <Navigate to="/landing" replace />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};


function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/landing" 
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          } 
        />

        <Route 
          path="/auth" 
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          } 
        />

        <Route 
          path="/" 
          element={
            <PublicRoute>
              <DashboardPage />
            </PublicRoute>
          } 
        />

        <Route 
          path="/projects" 
          element={
            <PublicRoute>
              <ProjectsPage />
            </PublicRoute>
          } 
        />

        <Route 
          path="/activity" 
          element={
            <PublicRoute>
              <ActivityPage />
            </PublicRoute>
          } 
        />



        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App

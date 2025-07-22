import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          
          {/* Public routes */}
          <Route path="projects" element={<div>Projects Page (TODO)</div>} />
          <Route path="developers" element={<div>Developers Page (TODO)</div>} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          
          {/* Protected routes */}
          <Route
            path="my-projects"
            element={
              <ProtectedRoute>
                <div>My Projects Page (TODO)</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <div>Profile Page (TODO)</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="projects/new"
            element={
              <ProtectedRoute>
                <div>Create Project Page (TODO)</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="projects/:id/edit"
            element={
              <ProtectedRoute>
                <div>Edit Project Page (TODO)</div>
              </ProtectedRoute>
            }
          />
          
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App

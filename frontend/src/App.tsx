import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { MindMapProvider } from './contexts/MindMapContext';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './pages/Editor';
import { Viewer } from './pages/Viewer';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MindMapProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Header />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/editor/:id" element={
                  <ProtectedRoute>
                    <Editor />
                  </ProtectedRoute>
                } />
                <Route path="/viewer/:id" element={
                  <ProtectedRoute>
                    <Viewer />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </Router>
        </MindMapProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
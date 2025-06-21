import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SIgnUp';
import { Facebook } from './pages/Facebook';
import { useState, useEffect } from 'react';
import './App.css';
import { ConnectForm } from './pages/ConnectForm';
import { ConnectList } from './pages/ConnectList';
import { Dashboard } from './pages/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn onSignIn={() => setIsAuthenticated(true)} />} />
        <Route 
          path="/signin" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <SignIn onSignIn={() => setIsAuthenticated(true)} />
          } 
        />
        <Route 
          path="/signup" 
          element={
            isAuthenticated ? 
              <Navigate to="/facebook" replace /> : 
              <SignUp onSignUp={() => setIsAuthenticated(true)} />
          } 
        />
        <Route 
          path="/facebook" 
          element={
            isAuthenticated ? (
              <Facebook />
            ) : (
              <Navigate to="/signin" replace />
            )
          } 
        />
        <Route 
          path="/connectform" 
          element={
            isAuthenticated ? (
              <ConnectForm />
            ) : (
              <Navigate to="/facebook" replace />
            )
          } 
        />
        <Route 
          path="/connection" 
          element={
            isAuthenticated ? (
              <ConnectList />
            ) : (
              <Navigate to="/signin" replace />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <Dashboard />
            ) : (
              <Navigate to="/signin" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
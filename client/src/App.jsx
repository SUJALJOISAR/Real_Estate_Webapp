import {Routes,Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import About from './pages/About';
import Header from './components/Header';
import Signin from './pages/Signin';
import { useContext } from 'react';
import { AuthContext } from './context-api/authContext';
import UpdateProfile from './pages/UpdateProfile';
import PropTypes from 'prop-types';
import CreateListing from './pages/CreateListing';

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/register" />;
}

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Header />
      <Routes>
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/updateprofile"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
         <Route
          path="/createListing"
          element={
            <ProtectedRoute>
              <CreateListing />
            </ProtectedRoute>
          }
        />
        {/* Public Routes */}
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/signin" element={!user ? <Signin /> : <Navigate to="/" />} />
      </Routes>
    </>
  );
}

// Add PropTypes validation
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};


export default App

import {Routes,Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import About from './pages/About';
import Header from './components/Header';
import Signin from './pages/Signin';
import { useContext } from 'react';
import { AuthContext } from './context-api/authContext';


function App() {
  const {user}= useContext(AuthContext);
  return (
    <>
      <Header />
      <Routes>
      <Route path="/" element={user ? <Home /> : <Navigate to="/register" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/signin" element={!user ? <Signin /> : <Navigate to="/" />} />
        <Route path="/about" element={<About/>} />
      </Routes>
    </>
  )
}

export default App

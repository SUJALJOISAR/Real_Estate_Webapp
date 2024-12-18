import {Routes,Route} from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import About from './pages/About';
import Header from './components/Header';
import Signin from './pages/Signin';


function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/signin" element={<Signin/>} />
        <Route path="/about" element={<About/>} />
      </Routes>
    </>
  )
}

export default App


import './App.css'
import { Route, Routes } from 'react-router-dom';
import Landing from './component/landing/Landing';
import NavBar from './component/navbar/NavBar';
import { useLocation } from 'react-router-dom';
import Home from './views/home/Home';
import Detail from './views/detail/Detail';
import Create from './views/create/Create';
import About from './views/about/about';


function App() {
  const location = useLocation()

  return (
    <div className='container'>
      {location.pathname !== "/" && <NavBar />}
      <Routes>
        <Route path='/' element={<Landing />} ></Route>
        <Route path='/home' element={<Home />} ></Route>
        <Route path='/detail/:id' element={<Detail />}></Route>
        <Route path='/create' element={<Create />} ></Route>
        <Route path='/about' element={<About />} ></Route>
      </Routes>
    </div>
  )
}

export default App

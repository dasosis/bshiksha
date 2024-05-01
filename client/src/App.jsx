import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './pages/Login';
import Home from './pages/Home';

import './App.scss';

const App = () => {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/home' element={<Home />} />
          <Route path='/' element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

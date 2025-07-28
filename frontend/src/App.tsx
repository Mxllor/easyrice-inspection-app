import { Routes, Route } from 'react-router-dom';
// import { AppBar, Toolbar, Typography } from '@mui/material';
import Navbar from './assets/components/Navbar';
import Landing from './assets/pages/Landing';
import Create from './assets/pages/Create';
import NotFound from './assets/pages/NotFound';
import Inspection from './assets/pages/Inspection';
import './App.css';
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create" element={<Create />} />
        <Route path="/inspection/:id" element={<Inspection />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
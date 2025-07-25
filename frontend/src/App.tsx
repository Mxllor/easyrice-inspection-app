import { Routes, Route } from 'react-router-dom';
// import { AppBar, Toolbar, Typography } from '@mui/material';
import Navbar from './assets/components/Navbar';
import Landing from './assets/pages/Landing';
import Create from './assets/pages/Create';
import NotFound from './assets/pages/NotFound';
import './App.css';
function App() {
  return (
    <>
      {/* <nav style={{ marginBottom: 20 }}>
        <Link to="/">Create</Link> |{' '}
        <Link to="/about">About</Link>
      </nav> */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create" element={<Create />} />
        {/* <Route path="/about" element={<About />} /> */}
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
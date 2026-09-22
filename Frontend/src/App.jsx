import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Settings from './pages/Settings';
import PrivateNotes from './pages/PrivateNotes';
import Notes from './pages/Notes'; // <-- Thêm import này

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="settings" element={<Settings />} />
          <Route path="private" element={<PrivateNotes />} />
          <Route path="notes" element={<Notes />} /> 
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
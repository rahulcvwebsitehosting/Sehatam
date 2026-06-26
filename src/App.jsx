import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SymptomCheck from './pages/SymptomCheck';
import Results from './pages/Results';
import History from './pages/History';
import Login from './pages/Login';
import Clinics from './pages/Clinics';
import Navbar from './components/Navbar';
import BottomNavBar from './components/BottomNavBar';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-surface">
        <Navbar />
        <main className="flex-1 w-full mx-auto bg-white shadow-sm overflow-x-hidden pb-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/check" element={<SymptomCheck />} />
            <Route path="/results" element={<Results />} />
            <Route path="/clinics" element={<Clinics />} />
            <Route path="/history" element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <BottomNavBar />
      </div>
    </BrowserRouter>
  );
};

export default App;

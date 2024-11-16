import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CompanyTest from './components/CompanyTest';
import TestPage from './components/TestPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/company/:id" element={<CompanyTest />} />
        <Route path="/test/:companyId" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
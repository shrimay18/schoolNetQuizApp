import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MockExamCardHolder from './pages/MockExamCardHolder';
import ExamPage from './pages/ExamPage';
import ExamDetails from './pages/ExamDetails';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/mock-exam" element={<MockExamCardHolder />} />
        <Route path="/mock-exam/:examId" element={<ExamDetails />} />
        <Route path="/mock-exam/:examId/start" element={<ExamPage />} />
        <Route path="/" element={<Navigate replace to="/mock-exam" />} />
      </Routes>
    </Router>
  );
};

export default App;
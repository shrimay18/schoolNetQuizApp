// src/components/MockExamCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';

interface MockExamCardProps {
  id: string;
  title: string;
  description: string;
  duration: number;
  questionCount: number;
}

const MockExamCard: React.FC<MockExamCardProps> = ({ id, title, description, duration, questionCount }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full border border-purple-200">
      <h2 className="text-xl font-bold mb-2 text-purple-800">{title}</h2>
      <p className="text-purple-600 mb-4">{description}</p>
      <div className="flex justify-between text-sm text-purple-500">
        <span>{duration} minutes</span>
        <span>{questionCount} questions</span>
      </div>
      <Link 
        to={`/mock-exam/${id}`}
        className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors inline-block text-center"
      >
        Start Exam
      </Link>
    </div>
  );
};

export default MockExamCard;
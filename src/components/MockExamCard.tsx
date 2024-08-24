import React from 'react';
import { Link } from 'react-router-dom';

// Define the prop types for the MockExamCard component
interface MockExamCardProps {
  id: string;
  title: string;
  description: string;
  duration: number;
  questionCount: number;
}

// MockExamCard component: Displays information about a mock exam and provides a link to start it
const MockExamCard: React.FC<MockExamCardProps> = ({ id, title, description, duration, questionCount }) => {
  return (
    // Main container for the card
    <div className="bg-white rounded-lg shadow-md p-6 w-full border border-purple-200">
      {/* Exam title */}
      <h2 className="text-xl font-bold mb-2 text-purple-800">{title}</h2>
      
      {/* Exam description */}
      <p className="text-purple-600 mb-4">{description}</p>
      
      {/* Exam details: duration and question count */}
      <div className="flex justify-between text-sm text-purple-500">
        <span>{duration} minutes</span>
        <span>{questionCount} questions</span>
      </div>
      
      {/* Link to start the exam */}
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
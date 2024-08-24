import React from 'react';
import MockExamCard from '../components/MockExamCard';

// Define the MockExamCardHolder component
const MockExamCardHolder: React.FC = () => {
    // Array of mock exam data
    const mockExams = [
    {
      id:"example",
      title: "GK P1",
      description: "Test your math skills with this comprehensive mock exam.",
      duration: 60,
      questionCount: 10
    },
    {
      id:"example",
      title: "GK P2",
      description: "Prepare for your science exam with this practice test.",
      duration: 60,
      questionCount: 10
    },
    {
      id:"example",
      title: "GK P3",
      description: "Enhance your English language proficiency with this mock exam.",
      duration: 60,
      questionCount: 10
    }
    ];

    return (
      // Main container with background gradient and padding
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white py-12 px-4 sm:px-6 lg:px-8">
        {/* Content wrapper with max width */}
        <div className="max-w-7xl mx-auto">
          {/* Page title */}
          <h1 className="text-4xl font-bold text-center mb-10 text-purple-800">Mock Exams</h1>
          {/* Grid container for exam cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Map through mockExams array and render a MockExamCard for each exam */}
            {mockExams.map((exam) => (
              <MockExamCard
                id={exam.id}
                key={exam.id}
                title={exam.title}
                description={exam.description}
                duration={exam.duration}
                questionCount={exam.questionCount}
              />
            ))}
          </div>
        </div>
      </div>
    );
};

export default MockExamCardHolder;
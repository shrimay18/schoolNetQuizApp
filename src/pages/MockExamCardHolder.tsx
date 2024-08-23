// src/pages/MockExamCardHolder.tsx

import React from 'react';
import MockExamCard from '../components/MockExamCard';

const MockExamCardHolder: React.FC = () => {
    const mockExams = [
    {
      id:"example",
      title: "Math Mock Exam",
      description: "Test your math skills with this comprehensive mock exam.",
      duration: 60,
      questionCount: 3
    },
    {
      id:"example",
      title: "Science Mock Exam",
      description: "Prepare for your science exam with this practice test.",
      duration: 90,
      questionCount: 4
    },
    {
      id:"example",
      title: "English Mock Exam",
      description: "Enhance your English language proficiency with this mock exam.",
      duration: 75,
      questionCount: 4
    }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-10 text-purple-800">Mock Exams</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
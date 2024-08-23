// src/pages/ExamDetails.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface ExamInfo {
  title: string;
  description: string;
  duration: number;
  questionCount: number;
}

const examData: { [key: string]: ExamInfo } = {
  example: {
    title: "Example Mock Exam",
    description: "This is an example mock exam to test your knowledge.",
    duration: 60,
    questionCount: 3,
  },
};

const ExamDetails: React.FC = () => {
  const navigate = useNavigate();
  const { examId } = useParams<{ examId: string }>();
  const [exam, setExam] = useState<ExamInfo | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  useEffect(() => {
    // Simulate fetching exam data
    if (examId && examData[examId]) {
      setExam(examData[examId]);
      
      // Simulate fetching progress from local storage or an API
      const storedProgress = localStorage.getItem(`exam_${examId}_progress`);
      if (storedProgress) {
        setProgress(parseInt(storedProgress));
        setIsStarted(true);
      }
    }
  }, [examId]);

  const handleStartExam = () => {
    if (!isStarted) {
      setIsStarted(true);
      setProgress(0);
      localStorage.setItem(`exam_${examId}_progress`, '0');
    }
    navigate(`/mock-exam/${examId}/start`);
    // Here you would typically navigate to the actual exam page
    console.log('Starting/Continuing exam');
  };

  if (!exam) {
    return <div>Exam not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-500 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4 text-purple-800">{exam.title}</h1>
        <p className="text-purple-600 mb-6">{exam.description}</p>
        <div className="mb-6 text-purple-700">
          <p><strong>Duration:</strong> {exam.duration} minutes</p>
          <p><strong>Number of Questions:</strong> {exam.questionCount}</p>
        </div>
        {isStarted && (
          <div className="mb-6">
            <p className="mb-2 text-purple-700"><strong>Your Progress:</strong></p>
            <div className="w-full bg-purple-200 rounded-full h-2.5">
              <div 
                className="bg-purple-600 h-2.5 rounded-full" 
                style={{width: `${progress}%`}}
              ></div>
            </div>
            <p className="mt-2 text-purple-600">{progress}% Complete</p>
          </div>
        )}
        <div className="flex justify-between">
          <Link 
            to="/mock-exam" 
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
          >
            Back to Exams
          </Link>
          <button 
            onClick={handleStartExam}
            className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors"
          >
            {isStarted ? 'Continue Exam' : 'Start Exam'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamDetails;
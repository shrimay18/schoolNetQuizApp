import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface Question {
  text: string;
  options: string[];
  correctAnswer: number | number[];
  multipleCorrect?: boolean;
}

interface AnswerReviewPopupProps {
  questions: Question[];
  userAnswers: (number[] | null)[];
  onClose: () => void;
}

const AnswerReviewPopup: React.FC<AnswerReviewPopupProps> = ({ questions, userAnswers, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-purple-600">Answer Review</h2>
        {questions.map((question, index) => (
          <div key={index} className="mb-6 pb-4 border-b border-purple-200">
            <p className="font-semibold mb-2 text-purple-800">
              {index + 1}. {question.text}
              {question.multipleCorrect && 
                <span className="text-sm font-normal text-purple-600 ml-2">(Multiple correct answers)</span>
              }
            </p>
            {question.options.map((option, optionIndex) => {
              const isUserAnswer = userAnswers[index]?.includes(optionIndex);
              const isCorrectAnswer = Array.isArray(question.correctAnswer) 
                ? question.correctAnswer.includes(optionIndex)
                : question.correctAnswer === optionIndex;
              
              let bgColor = 'bg-white';
              let textColor = 'text-gray-800';
              let borderColor = 'border-gray-200';

              if (isUserAnswer) {
                if (isCorrectAnswer) {
                  bgColor = 'bg-green-100';
                  textColor = 'text-green-800';
                  borderColor = 'border-green-500';
                } else {
                  bgColor = 'bg-red-100';
                  textColor = 'text-red-800';
                  borderColor = 'border-red-500';
                }
              } else if (isCorrectAnswer) {
                bgColor = 'bg-green-100';
                textColor = 'text-green-800';
                borderColor = 'border-green-500';
              }

              return (
                <div 
                  key={optionIndex} 
                  className={`p-2 rounded mb-2 ${bgColor} ${textColor} ${borderColor} border-2`}
                >
                  {option}
                  {isUserAnswer && !isCorrectAnswer && (
                    <span className="ml-2 font-semibold text-red-600">
                      (Your Answer)
                    </span>
                  )}
                  {isUserAnswer && isCorrectAnswer && (
                    <span className="ml-2 font-semibold text-green-600">
                      (Your Answer)
                    </span>
                  )}
                  {isCorrectAnswer && !isUserAnswer && (
                    <span className="ml-2 font-semibold text-green-600">
                      (Correct Answer)
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default AnswerReviewPopup;

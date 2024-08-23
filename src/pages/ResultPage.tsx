import React,{useState} from 'react';
import { motion,AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Smile, Frown, Award } from 'lucide-react';
import Confetti from 'react-confetti';
import AnswerReviewPopup from './AnswerReviewPopup';

interface Question {
    text: string;
    options: string[];
    correctAnswer: number | number[];
}
interface ResultPageProps {
    totalQuestions: number;
    attemptedQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    unattemptedQuestions: number;
    timeSpent: number;
    onCheckAnswers: () => void;
    questions: Question[];
    userAnswers: (number | null)[];
}

const ResultPage: React.FC<ResultPageProps> = ({
  totalQuestions,
  attemptedQuestions,
  correctAnswers,
  timeSpent,
  onCheckAnswers,
  questions,
  userAnswers
}) => {
  const [showAnswerReview, setShowAnswerReview] = useState(false);
  const formattedUserAnswers: (number[] | null)[] = userAnswers.map(answer => 
    answer !== null ? [answer] : null
  );
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  const getResultMessage = () => {
    if (score <= 50) {
      return {
        icon: <Frown size={48} className="text-purple-500" />,
        message: "\"Don't worry champ, let's cheer up and revisit the concept and improve in next exam!\"",
        animation: "shake"
      };
    } else if (score <= 75) {
      return {
        icon: <Smile size={48} className="text-purple-500" />,
        message: "\"You were almost there, just a little more effort and then sky is the limit!\"",
        animation: "pulse"
      };
    } else {
      return {
        icon: <Award size={48} className="text-purple-500" />,
        message: "\"Well done champ! Keep the hard work coming!\"",
        animation: "bounce"
      };
    }
  };

  const { icon, message, animation } = getResultMessage();

  const animationVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { repeat: Infinity, duration: 1.5 }
    },
    pulse: {
      scale: [1, 1.1, 1],
      transition: { repeat: Infinity, duration: 1.5 }
    },
    bounce: {
      y: [0, -20, 0],
      transition: { repeat: Infinity, duration: 1.5 }
    }
  };

  const CircleResult = ({ value, total, label }: { value: number, total: number, label: string }) => (
    <div className="flex flex-col items-center mb-6">
      <h3 className="text-lg font-semibold mb-2 text-purple-800">{label}</h3>
      <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center relative overflow-hidden">
        <div className="text-center bg-white rounded-full w-28 h-28 flex flex-col justify-center items-center shadow-md">
          <div className="text-3xl font-bold text-purple-600">{value}</div>
          <div className="text-sm text-purple-400">out of</div>
          <div className="text-xl text-purple-600">{total}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col">
      {score > 75 && <Confetti numberOfPieces={200} recycle={false} />}
      <nav className="bg-purple-700 shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Exam Results</h1>
          <Link to="/mock-exam" className="text-white hover:text-purple-200 transition duration-300">Go Back to Home</Link>
        </div>
      </nav>
      <div className="flex-grow flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full"
        >
          <motion.div
            className="flex justify-center mb-6"
            variants={animationVariants}
            animate={animation}
          >
            {icon}
          </motion.div>
          <motion.p 
            className="text-center text-xl font-semibold mb-8 text-purple-600 italic"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {message}
          </motion.p>
          <div className="flex flex-col sm:flex-row justify-around mb-6">
            <CircleResult 
              value={attemptedQuestions} 
              total={totalQuestions} 
              label="Questions Attempted" 
            />
            <CircleResult 
              value={correctAnswers} 
              total={totalQuestions} 
              label="Marks Scored" 
            />
          </div>
          <motion.p 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mb-6 text-purple-800"
          >
            <strong>Time Spent:</strong> {Math.floor(timeSpent / 60)} minutes {timeSpent % 60} seconds
          </motion.p>
          <motion.button
            onClick={() => setShowAnswerReview(true)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Check Your Answers
          </motion.button>
        </motion.div>
      </div>
      <AnimatePresence>
        {showAnswerReview && (
        <AnswerReviewPopup
          questions={questions}
          userAnswers={formattedUserAnswers}
          onClose={() => setShowAnswerReview(false)}
        />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResultPage;
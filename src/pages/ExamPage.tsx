import React, { useState, useEffect, useRef, useCallback} from 'react';
import { useParams } from 'react-router-dom';
import { BookmarkIcon, Info, FileText,X, ArrowLeft,ArrowRight } from 'lucide-react';
import ResultPage from './ResultPage';
import { Sun, Moon } from 'lucide-react';

// Define types for single-answer and multiple-answer questions
interface SingleAnswerQuestion {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  multipleCorrect: false;
}

interface MultipleAnswerQuestion {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number[];
  multipleCorrect: true;
}

type Question = SingleAnswerQuestion | MultipleAnswerQuestion;

// Mock questions data (in a real application, this would likely come from an API)
const mockQuestions: Question[] = [
  {
    id: 1,
    text: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    multipleCorrect: false
  },
  {
    id: 2,
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    multipleCorrect: false
  },
  {
    id: 3,
    text: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2,
    multipleCorrect: false
  },
  {
    id: 4,
    text: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: 3,
    multipleCorrect: false
  },
  {
    id: 5,
    text: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Silver", "Oxygen", "Iron"],
    correctAnswer: 2,
    multipleCorrect: false
  },
  {
    id: 6,
    text: "What is the capital of Japan?",
    options: ["Tokyo", "Beijing", "Seoul", "Bangkok"],
    correctAnswer: 0,
    multipleCorrect: false
  },
  {
    id: 7,
    text: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: 1,
    multipleCorrect: false
  },
  {
    id: 8,
    text: "Is Elephant the largest mammal in the world?",
    options: ["True","False"],
    correctAnswer: 1,
    multipleCorrect: false
  },
  {
    id: 9,
    text: "Which of the following are primary colors? (Select all that apply)",
    options: ["Red", "Green", "Blue", "Yellow"],
    correctAnswer: [0, 2, 3],
    multipleCorrect: true
  },
  {
    id: 10,
    text: "Which of these countries are in Europe? (Select all that apply)",
    options: ["Spain", "Brazil", "Germany", "Japan"],
    correctAnswer: [0, 2],
    multipleCorrect: true
  }
];

const ExamPage: React.FC = () => {
  // Extract examId from URL parameters
  const { examId } = useParams<{ examId: string }>();

  // State variables
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number[] | null)[]>(new Array(mockQuestions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(3600); 
  const [showTimer, setShowTimer] = useState(true);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [palettePosition, setPalettePosition] = useState({ top: 0, left: 0 });
  const [canProceed, setCanProceed] = useState(true);
  const [answerStatus, setAnswerStatus] = useState<('correct' | 'incorrect' | null)[]>(new Array(mockQuestions.length).fill(null));
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(new Array(mockQuestions.length).fill(false));
  const [autoProgressTimer, setAutoProgressTimer] = useState<NodeJS.Timeout | null>(null);

  const infoBtnRef = useRef<HTMLButtonElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  const answeredCount = userAnswers.filter(answer => answer !== null && answer.length > 0).length;
  const progressPercentage = (answeredCount / mockQuestions.length) * 100;

  // Effect for window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      updatePalettePosition();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Effect for updating palette position
  useEffect(() => {
    updatePalettePosition();
  }, [showPalette]);

  // Effect for timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!showResult) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer);
            setShowResult(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showResult]);

  // Effect for handling clicks outside the palette
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showPalette && 
          paletteRef.current && 
          !paletteRef.current.contains(event.target as Node) &&
          infoBtnRef.current &&
          !infoBtnRef.current.contains(event.target as Node)) {
        setShowPalette(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPalette]);

  // Function to update palette position
  const updatePalettePosition = () => {
    if (infoBtnRef.current && windowWidth >= 640) {
      const rect = infoBtnRef.current.getBoundingClientRect();
      setPalettePosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX - 250,
      });
    }
  };

  // Function to toggle dark mode
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
    document.body.classList.toggle('dark');
  };

  // Function to handle user answers
  const handleAnswer = (optionIndex: number) => {
    const currentQuestion = mockQuestions[currentQuestionIndex];
    const newAnswers = [...userAnswers];
    const newAnswerStatus = [...answerStatus];
    
    if (currentQuestion.multipleCorrect) {
      if (newAnswerStatus[currentQuestionIndex] === 'incorrect') return; // Prevent further selection if already incorrect

      const currentAnswer = newAnswers[currentQuestionIndex] || [];
      if (currentAnswer.includes(optionIndex)) {
        newAnswers[currentQuestionIndex] = currentAnswer.filter(i => i !== optionIndex);
      } else {
        newAnswers[currentQuestionIndex] = [...currentAnswer, optionIndex];
      }

      if (currentQuestion.correctAnswer.includes(optionIndex)) {
        newAnswerStatus[currentQuestionIndex] = 'correct';
      } else {
        newAnswerStatus[currentQuestionIndex] = 'incorrect';
      }
    } else {
      if (answeredQuestions[currentQuestionIndex]) return;
      newAnswers[currentQuestionIndex] = [optionIndex];
      newAnswerStatus[currentQuestionIndex] = optionIndex === currentQuestion.correctAnswer ? 'correct' : 'incorrect';
  
      const newAnsweredQuestions = [...answeredQuestions];
      newAnsweredQuestions[currentQuestionIndex] = true;
      setAnsweredQuestions(newAnsweredQuestions);
  
      // Trigger auto-progression for non-last questions
      if (currentQuestionIndex < mockQuestions.length - 1) {
        if (autoProgressTimer) clearTimeout(autoProgressTimer);
        const timer = setTimeout(() => {
          handleNext();
        }, 500);
        setAutoProgressTimer(timer);
      }
    }

    setUserAnswers(newAnswers);
    setAnswerStatus(newAnswerStatus);
  };

  useEffect(() => {
    return () => {
      if (autoProgressTimer) clearTimeout(autoProgressTimer);
    };
  }, [autoProgressTimer]);

  // Functions for navigation and exam control
  const handleNext = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      if (autoProgressTimer) clearTimeout(autoProgressTimer);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      if (autoProgressTimer) clearTimeout(autoProgressTimer);
    }
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  const toggleBookmark = () => {
    setBookmarks(prevBookmarks => 
      prevBookmarks.includes(currentQuestionIndex)
        ? prevBookmarks.filter(index => index !== currentQuestionIndex)
        : [...prevBookmarks, currentQuestionIndex]
    );
  };

  // Helps to convert time format to minutes and seconds
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const getQuestionStatus = (index: number) => {
    if (userAnswers[index] !== null && userAnswers[index]!.length > 0 && bookmarks.includes(index)) return 'attempted-review';
    if (userAnswers[index] !== null && userAnswers[index]!.length > 0) return 'solved';
    if (bookmarks.includes(index)) return 'review';
    return 'unsolved';
  };

  const handleInfoClick = () => {
    setShowPalette(prev => !prev);
  };

  const isAnswerCorrect = (questionIndex: number): boolean => {
    const question = mockQuestions[questionIndex];
    const userAnswer = userAnswers[questionIndex];
    
    if (!userAnswer) return false;
    
    if (question.multipleCorrect) {
      return userAnswer.length === question.correctAnswer.length &&
             userAnswer.every(answer => question.correctAnswer.includes(answer));
    } else {
      return userAnswer.length === 1 && userAnswer[0] === question.correctAnswer;
    }
  };

  // Question Palette component
  const QuestionPalette = () => {
    const isSmallScreen = windowWidth < 640;
    return(
      <div 
        ref={paletteRef}
        className={`fixed ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-4 rounded-lg shadow-lg overflow-y-auto z-50 ${
          isSmallScreen ? 'inset-0' : ''
        }`}
        style={isSmallScreen ? {} : {
          top: `${palettePosition.top}px`,
          left: `${palettePosition.left}px`,
          width: '300px',
          maxHeight: '80vh'
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>Question Palette</h3>
          <button onClick={() => setShowPalette(false)} className={`${isDarkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-700'}`}>
            <X size={24} />
          </button>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {mockQuestions.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentQuestionIndex(index);
                setShowPalette(false);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                getQuestionStatus(index) === 'solved' ? 'bg-green-500' :
                getQuestionStatus(index) === 'review' ? 'bg-yellow-500' :
                getQuestionStatus(index) === 'attempted-review' ? 'bg-purple-500' :
                isDarkMode ? 'bg-gray-600' : 'bg-purple-300'
              } ${currentQuestionIndex === index ? 'ring-2 ring-offset-2 ring-purple-600' : ''}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div className={`mt-4 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Solved</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span>Marked for Review</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span>Attempted & Marked for Review</span>
          </div>
          <div className="flex items-center">
            <div className={`w-3 h-3 ${isDarkMode ? 'bg-gray-600' : 'bg-purple-300'} rounded-full mr-2`}></div>
            <span>Unsolved</span>
          </div>
        </div>
      </div>
    ); 
  };

  // Render result page if exam is finished
  if (showResult) {
    const attemptedQuestions = userAnswers.filter(answer => answer !== null && answer.length > 0).length;
    const correctAnswers = userAnswers.filter((_, index) => isAnswerCorrect(index)).length;
    const wrongAnswers = attemptedQuestions - correctAnswers;
    const unattemptedQuestions = mockQuestions.length - attemptedQuestions;
    const timeSpent = 3600 - timeLeft;

    return (
      <ResultPage
        totalQuestions={mockQuestions.length}
        attemptedQuestions={attemptedQuestions}
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
        unattemptedQuestions={unattemptedQuestions}
        timeSpent={timeSpent}
        onCheckAnswers={() => setShowResult(false)}
        questions={mockQuestions as any}  // Type assertion to avoid mismatch
        userAnswers={userAnswers as any}  // Type assertion to avoid mismatch
      />
    );
  }

  const currentQuestion = mockQuestions[currentQuestionIndex];

  // Main component render
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-purple-50 to-white'}`}>
      <nav className={`fixed top-0 left-0 right-0 z-10 ${isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-purple-600 to-purple-400'} shadow-md p-2 sm:p-4`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl text-white truncate flex-shrink-0 max-w-[30%]">
            {examId}
          </h1>
          <div className="flex flex-col items-center">
            {showTimer && (
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-white">
                {formatTime(timeLeft)}
              </span>
            )}
            <button 
              onClick={() => setShowTimer(!showTimer)}
              className="text-xs sm:text-sm text-white hover:text-purple-200"
            >
              {showTimer ? 'Hide' : 'Show Timer'}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="bg-white rounded-full p-1 sm:p-1.5 shadow-md text-purple-600 hover:text-purple-800 transition-transform duration-300 ease-in-out transform hover:scale-110"
            >
              {isDarkMode ? <Sun size={14} className="w-3 h-3 sm:w-4 sm:h-4" /> : <Moon size={14} className="w-3 h-3 sm:w-4 sm:h-4" />}
            </button>
            <button
              ref={infoBtnRef}
              onClick={handleInfoClick}
              className="bg-white rounded-full p-1 sm:p-1.5 shadow-md text-purple-600 hover:text-purple-800 transition-transform duration-300 ease-in-out transform hover:scale-110"
            >
              <Info size={14} className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </nav>
      <main className={`max-w-3xl mx-auto px-2 sm:px-4 lg:px-8 ${isDarkMode ? 'text-white' : ''}`} style={{ paddingTop: 'calc(2rem + 32px)' }}>
        <div className="text-center mb-2 sm:mb-4 text-purple-600 text-sm sm:text-base font-semibold">
          Question {currentQuestionIndex + 1} of {mockQuestions.length}
        </div>
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg relative p-3 sm:p-6 border ${isDarkMode ? 'border-gray-700' : 'border-purple-200'}`}>
          <button 
            onClick={toggleBookmark}
            className={`absolute top-2 sm:top-4 right-2 sm:right-4 text-purple-500 hover:text-purple-600 transition-all duration-300 transform ${
              bookmarks.includes(currentQuestionIndex) ? 'scale-110' : 'scale-100'
            }`}
          >
            <BookmarkIcon 
              size={20} 
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill={bookmarks.includes(currentQuestionIndex) ? "currentColor" : "none"}
            />
          </button>
          
          <h2 className={`text-base sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4 pr-8 sm:pr-10 ${isDarkMode ? 'text-white' : 'text-purple-800'}`}>
            {currentQuestion.text}
          </h2>
          
          <div className="space-y-2 sm:space-y-4 mb-4 sm:mb-6">
      {currentQuestion.options.map((option, index) => {
        const isSelected = userAnswers[currentQuestionIndex]?.includes(index);
        const status = answerStatus[currentQuestionIndex];
        let buttonClass = `w-full p-2 sm:p-4 text-left rounded-md transition-colors text-sm sm:text-base ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        } `;
        
        if (isSelected) {
          if (currentQuestion.multipleCorrect) {
            buttonClass += status === 'incorrect' ? 'bg-red-500 border-2 border-red-600 ' : 'bg-green-500 border-2 border-green-600 ';
          } else {
            buttonClass += status === 'correct' ? 'bg-green-500 border-2 border-green-600 ' : 'bg-red-500 border-2 border-red-600 ';
          }
        } else {
          buttonClass += isDarkMode 
            ? 'bg-gray-700 hover:bg-gray-600 ' 
            : 'bg-gray-50 hover:bg-gray-100 ';
        }

        return (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className={buttonClass}
            disabled={
              (currentQuestion.multipleCorrect && status === 'incorrect') ||
              (!currentQuestion.multipleCorrect && answeredQuestions[currentQuestionIndex])
            }
          >
            {option}
          </button>
        );
      })}
    </div>
          
          <div className="flex justify-between items-center border-t pt-4 sm:pt-6">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-white text-sm sm:text-base ${
                currentQuestionIndex === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              <ArrowLeft size={16} className="mr-1 sm:mr-2" />
              Previous
            </button>
            
            {currentQuestionIndex === mockQuestions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-white bg-green-600 hover:bg-green-700 text-sm sm:text-base"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className={`flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-white text-sm sm:text-base ${
                  canProceed ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Next
                <ArrowRight size={16} className="ml-1 sm:ml-2" />
              </button>
            )}
          </div>
  
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-purple-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
            Progress: {answeredCount} of {mockQuestions.length} questions answered ({Math.round(progressPercentage)}%)
          </div>
        </div>
      </main>
  
      {showPalette && <QuestionPalette />}
    </div>
  );

};
  
export default ExamPage;
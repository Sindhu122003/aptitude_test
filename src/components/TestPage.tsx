import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Webcam from 'react-webcam';
import { AlertCircle, Loader2 } from 'lucide-react';
import { questions } from '../data/questions';
import TestResult from './TestResult';
import { useMonitoring } from './monitoring/useMonitoring';
import { useAudioMonitoring } from './monitoring/useAudioMonitoring';

function TestPage() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [localWarning, setLocalWarning] = useState<string | null>(null);

  const companyQuestions = companyId ? questions[companyId] : [];
  const { warning: monitoringWarning, isInitialized } = useMonitoring(webcamRef);
  
  useAudioMonitoring((warning) => setLocalWarning(warning));

  const warning = monitoringWarning || localWarning;

  useEffect(() => {
    document.documentElement.requestFullscreen().catch(console.error);
    setTimeLeft(companyQuestions.length * 120);

    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(console.error);
      }
    };
  }, [companyQuestions.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < companyQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const finalScore = answers.reduce((acc, answer, index) => {
      return acc + (answer === companyQuestions[index].correctAnswer ? 1 : 0);
    }, 0);
    setScore(finalScore);
    setIsTestComplete(true);
  };

  if (isTestComplete) {
    return (
      <TestResult 
        score={score} 
        totalQuestions={companyQuestions.length} 
        onBackToDashboard={() => navigate('/')} 
      />
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Initializing monitoring system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {warning && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-50 animate-bounce">
          <AlertCircle className="mr-2" />
          {warning}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-8">
          <div className="webcam-container w-48">
            <Webcam
              ref={webcamRef}
              audio={false}
              className="rounded-lg shadow-md"
              mirrored
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 1280,
                height: 720,
                facingMode: "user",
                frameRate: 30
              }}
            />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            Time Left: {formatTime(timeLeft)}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Question {currentQuestion + 1} of {companyQuestions.length}
            </h2>
            <p className="mt-4 text-lg text-gray-700">
              {companyQuestions[currentQuestion]?.question}
            </p>
          </div>

          <div className="space-y-4">
            {companyQuestions[currentQuestion]?.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer ${
                  answers[currentQuestion] === index ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                }`}
                onClick={() => handleAnswer(index)}
              >
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="answer"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  checked={answers[currentQuestion] === index}
                  onChange={() => handleAnswer(index)}
                />
                <label
                  htmlFor={`option-${index}`}
                  className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer flex-1"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                currentQuestion === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              Previous
            </button>
            {currentQuestion === companyQuestions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Submit Test
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestPage;
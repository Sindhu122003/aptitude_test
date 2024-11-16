import React from 'react';
import { Trophy, Home } from 'lucide-react';

interface TestResultProps {
  score: number;
  totalQuestions: number;
  onBackToDashboard: () => void;
}

function TestResult({ score, totalQuestions, onBackToDashboard }: TestResultProps) {
  const percentage = (score / totalQuestions) * 100;
  const getGrade = () => {
    if (percentage >= 90) return { text: 'Excellent!', color: 'text-green-500' };
    if (percentage >= 80) return { text: 'Very Good!', color: 'text-blue-500' };
    if (percentage >= 70) return { text: 'Good!', color: 'text-yellow-500' };
    if (percentage >= 60) return { text: 'Fair', color: 'text-orange-500' };
    return { text: 'Needs Improvement', color: 'text-red-500' };
  };

  const grade = getGrade();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Trophy className="h-16 w-16 text-yellow-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Test Complete!</h2>
          <p className={`text-2xl font-semibold ${grade.color} mb-6`}>
            {grade.text}
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {score}/{totalQuestions}
            </div>
            <div className="text-lg text-gray-600">
              Score: {percentage.toFixed(1)}%
            </div>
          </div>

          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestResult;
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Camera, Mic, User, Settings } from 'lucide-react';
import QuestionManager from './QuestionManager';

function CompanyTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false,
  });
  const [showQuestionManager, setShowQuestionManager] = useState(false);

  const handlePermissions = async (type: 'camera' | 'microphone') => {
    try {
      if (type === 'camera') {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setPermissions(prev => ({ ...prev, camera: true }));
      } else {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setPermissions(prev => ({ ...prev, microphone: true }));
      }
    } catch (error) {
      console.error(`Error accessing ${type}:`, error);
    }
  };

  const handleQuestionsLoaded = (questions: any[]) => {
    // Store questions in local storage or state management
    localStorage.setItem(`company-${id}-questions`, JSON.stringify(questions));
    setShowQuestionManager(false);
  };

  const startTest = () => {
    if (permissions.camera && permissions.microphone) {
      navigate(`/test/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Test Prerequisites
              </h2>
              <button
                onClick={() => setShowQuestionManager(!showQuestionManager)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Questions
              </button>
            </div>

            {showQuestionManager ? (
              <QuestionManager onQuestionsLoaded={handleQuestionsLoaded} />
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                      <span className="ml-3 text-lg font-medium text-gray-900">
                        Camera Access
                      </span>
                    </div>
                    {!permissions.camera ? (
                      <button
                        onClick={() => handlePermissions('camera')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Enable Camera
                      </button>
                    ) : (
                      <span className="text-green-600">✓ Enabled</span>
                    )}
                  </div>

                  {permissions.camera && (
                    <div className="relative w-full max-w-md mx-auto aspect-video">
                      <div className="absolute inset-0 border-4 border-dashed border-gray-300 rounded-lg z-10"></div>
                      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <div className="w-48 h-48 border-4 border-blue-400 rounded-full opacity-50"></div>
                        <User className="absolute text-blue-400 opacity-30 w-24 h-24" />
                      </div>
                      <Webcam
                        audio={false}
                        className="w-full h-full object-cover rounded-lg"
                        mirrored
                      />
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mic className="h-8 w-8 text-gray-400" />
                      <span className="ml-3 text-lg font-medium text-gray-900">
                        Microphone Access
                      </span>
                    </div>
                    {!permissions.microphone ? (
                      <button
                        onClick={() => handlePermissions('microphone')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Enable Microphone
                      </button>
                    ) : (
                      <span className="text-green-600">✓ Enabled</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8">
              <button
                onClick={startTest}
                disabled={!permissions.camera || !permissions.microphone}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  permissions.camera && permissions.microphone
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Start Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyTest;
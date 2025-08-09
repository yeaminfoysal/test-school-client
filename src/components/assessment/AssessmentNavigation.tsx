import React from 'react';
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react';

import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';

interface AssessmentNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  answers: number[];
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  showSubmit?: boolean;
}

const AssessmentNavigation: React.FC<AssessmentNavigationProps> = ({
  currentQuestion,
  totalQuestions,
  answers,
  onPrevious,
  onNext,
  onSubmit,
  canGoBack = true,
  canGoForward = true,
  showSubmit = false,
}) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const answeredCount = answers.filter(answer => answer !== -1).length;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
          <span className="text-sm text-gray-500">
            {answeredCount}/{totalQuestions} answered
          </span>
        </div>
        <ProgressBar progress={progress} color="primary" />
      </div>

      {/* Question indicators */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-1 mb-2">
          {Array.from({ length: totalQuestions }, (_, index) => {
            const isAnswered = answers[index] !== -1;
            const isCurrent = index === currentQuestion;
            
            return (
              <div
                key={index}
                className={`
                  w-6 h-6 rounded text-xs font-medium flex items-center justify-center
                  ${isCurrent
                    ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                    : isAnswered
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                  }
                `}
              >
                {index + 1}
              </div>
            );
          })}
        </div>
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-100 rounded"></div>
            <span>Answered</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-100 rounded"></div>
            <span>Not answered</span>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          icon={ChevronLeft}
          onClick={onPrevious}
          disabled={!canGoBack || currentQuestion === 0}
        >
          Previous
        </Button>

        <div className="flex space-x-2">
          {showSubmit && (
            <Button
              variant="primary"
              icon={Flag}
              onClick={onSubmit}
            >
              Submit Assessment
            </Button>
          )}
          
          {!showSubmit && (
            <Button
              variant="primary"
              icon={ChevronRight}
              iconPosition="right"
              onClick={onNext}
              disabled={!canGoForward || currentQuestion === totalQuestions - 1}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentNavigation;
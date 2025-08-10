import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Question } from '../../types';
import Card from '../common/Card';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  selectedAnswer: number;
  onAnswerSelect: (answerIndex: number) => void;
  showExplanation?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  selectedAnswer,
  onAnswerSelect,
  showExplanation = false,
}) => {
  return (
    <Card className="w-full">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Question {questionNumber}
          </h3>
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {question.level}
          </span>
        </div>

        <p className="text-gray-700 text-base leading-relaxed mb-6">
          {question.question}
        </p>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = showExplanation && index === question.correctAnswer;
          const isWrong = showExplanation && isSelected && index !== question.correctAnswer;

          return (
            <button
              key={index}
              onClick={() => !showExplanation && onAnswerSelect(index)}
              disabled={showExplanation}
              className={`
                w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                ${isSelected && !showExplanation
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
                ${isCorrect && showExplanation
                  ? 'border-green-500 bg-green-50'
                  : ''
                }
                ${isWrong && showExplanation
                  ? 'border-red-500 bg-red-50'
                  : ''
                }
                ${showExplanation ? 'cursor-not-allowed' : 'hover:bg-gray-50'}
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium
                  ${isSelected && !showExplanation
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 text-gray-500'
                  }
                  ${isCorrect && showExplanation
                    ? 'border-green-500 bg-green-500 text-white'
                    : ''
                  }
                  ${isWrong && showExplanation
                    ? 'border-red-500 bg-red-500 text-white'
                    : ''
                  }
                `}>
                  {showExplanation && isCorrect ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </div>
                <span className="text-gray-900 flex-1">{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {showExplanation && question.explanation && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Explanation:</h4>
          <p className="text-blue-800 text-sm">{question.explanation}</p>
        </div>
      )}
    </Card>
  );
};

export default QuestionCard;

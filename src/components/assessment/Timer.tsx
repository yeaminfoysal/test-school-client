import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Clock, Pause, Play, AlertTriangle } from 'lucide-react';

import { RootState } from '../../store';
import { decrementTimer, pauseTimer, resumeTimer } from '../../store/slices/assessmentSlice';
import { formatTime } from '../../utils/helpers';
import Button from '../common/Button';

interface TimerProps {
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ onTimeUp }) => {
  const dispatch = useDispatch();
  const { timer } = useSelector((state: RootState) => state.assessment);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer.isRunning && !timer.isPaused) {
      interval = setInterval(() => {
        dispatch(decrementTimer());
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer.isRunning, timer.isPaused, dispatch]);

  useEffect(() => {
    if (timer.timeLeft <= 0 && timer.isRunning) {
      onTimeUp();
    }
  }, [timer.timeLeft, timer.isRunning, onTimeUp]);

  const handlePauseResume = () => {
    if (timer.isPaused) {
      dispatch(resumeTimer());
    } else {
      dispatch(pauseTimer());
    }
  };

  const getTimerColor = () => {
    if (timer.timeLeft <= 300) return 'text-red-600'; // 5 minutes
    if (timer.timeLeft <= 600) return 'text-orange-600'; // 10 minutes
    return 'text-green-600';
  };

  const getProgressColor = () => {
    if (timer.timeLeft <= 300) return 'bg-red-500'; // 5 minutes
    if (timer.timeLeft <= 600) return 'bg-orange-500'; // 10 minutes
    return 'bg-green-500';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Time Remaining</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={timer.isPaused ? Play : Pause}
          onClick={handlePauseResume}
          disabled={timer.timeLeft <= 0}
        />
      </div>

      <div className="text-center mb-3">
        <span className={`text-2xl font-mono font-bold ${getTimerColor()}`}>
          {formatTime(timer.timeLeft)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ${getProgressColor()}`}
          style={{
            width: `${Math.max(0, (timer.timeLeft / (60 * 60)) * 100)}%`, // Assuming 60 minutes max
          }}
        />
      </div>

      {timer.timeLeft <= 300 && timer.timeLeft > 0 && (
        <div className="flex items-center justify-center space-x-2 text-red-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">Time running out!</span>
        </div>
      )}

      {timer.isPaused && (
        <div className="text-center">
          <span className="text-sm text-orange-600 font-medium">
            Timer paused
          </span>
        </div>
      )}
    </div>
  );
};

export default Timer;
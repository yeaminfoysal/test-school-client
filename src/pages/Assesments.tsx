import React, { useState, useEffect } from 'react';
import QuestionCard from '../components/assessment/QuestionCard';
import Timer from '../components/assessment/Timer';
import { useGetQuestionsQuery } from '../store/api/questionApi';
import { useDispatch, useSelector } from 'react-redux';
import { startTimer } from '../store/slices/assessmentSlice';
import { useSubmitAssessmentMutation } from '../store/api/assessmentApi';
import { RootState } from '../store';

const AssessmentPage: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const { data: questionsResponse, isLoading, error } = useGetQuestionsQuery(
        { page: 1, limit: 10, student: user?._id, level: user?.currentLevel },
        { skip: !user?._id || !user?.currentLevel }
    );
    const questions = questionsResponse?.data ?? [];

    const [answers, setAnswers] = useState<number[]>([]);
    const [showExplanation, setShowExplanation] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false); // ✅ Prevent multiple submissions

    const dispatch = useDispatch();
    const [submitAssessment, { isLoading: isSubmitting, isSuccess, isError }] = useSubmitAssessmentMutation();

    console.log(user);

    useEffect(() => {
        if (questions.length > 0) {
            setAnswers(Array(questions.length).fill(-1));
            dispatch(startTimer());
        }
    }, [questions, dispatch]);

    const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
        setAnswers(prev => {
            const updated = [...prev];
            updated[questionIndex] = answerIndex;
            return updated;
        });
    };

    const calculateCorrectAnswers = () => {
        return questions.reduce((count, question, index) => {
            return answers[index] === question.correctAnswer ? count + 1 : count;
        }, 0);
    };

    const submitResults = async () => {
        if (hasSubmitted) return; // ✅ Prevent calling API again

        setHasSubmitted(true); // Mark as submitted
        const totalCorrect = calculateCorrectAnswers();

        try {
            const response = await submitAssessment({
                level: questions[0].level,
                student: user?._id as string,
                answers,
                totalCorrect,
                totalQuestions: questions.length,
            }).unwrap(); // ✅ This resolves with API response data

            setShowExplanation(true);
            console.log("Submitted successfully!");
        } catch (err) {
            console.error("Submission failed:", err);
        }
    };

    const handleSubmit = () => {
        submitResults();
    };

    const handleTimeUp = () => {
        console.log('Time is up!');
        submitResults();
    };

    if (isLoading) return <div className="p-4 text-center">Loading questions...</div>;
    if (error) return <div className="p-4 text-center text-red-600">Failed to load questions.</div>;
    if (questions.length === 0) return <div className="p-4 text-center">No questions available.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-4">
            {/* Timer */}
            {!hasSubmitted && <Timer onTimeUp={handleTimeUp} />} {/* ✅ Stop showing timer after submission */}

            {/* Render all questions */}
            <div className="space-y-8">
                {questions.map((question, index) => (
                    <QuestionCard
                        key={question._id || index}
                        question={question}
                        questionNumber={index + 1}
                        selectedAnswer={answers[index]}
                        onAnswerSelect={(answerIndex) => handleAnswerSelect(index, answerIndex)}
                        showExplanation={showExplanation}
                    />
                ))}
            </div>

            {/* Submit button */}
            {!showExplanation && !hasSubmitted && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                    </button>
                </div>
            )}

            {isSuccess && <div className="text-green-600 text-center">Assessment submitted successfully!</div>}
            {isError && <div className="text-red-600 text-center">Failed to submit assessment.</div>}
        </div>
    );
};

export default AssessmentPage;

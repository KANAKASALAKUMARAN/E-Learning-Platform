import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Form, Alert, ProgressBar, Modal } from 'react-bootstrap';
import QuizService from '../../services/api/quizService';

const QuizComponent = ({ quizId, onQuizComplete }) => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  const fetchQuiz = useCallback(async () => {
    try {
      setLoading(true);
      const quizData = await QuizService.getQuizById(quizId);
      setQuiz(quizData);
      setAnswers(new Array(quizData.questions.length).fill({ selectedOption: null }));
    } catch (err) {
      setError('Failed to load quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  useEffect(() => {
    if (quiz && quiz.timeLimit && timeRemaining === null) {
      setTimeRemaining(quiz.timeLimit * 60); // Convert minutes to seconds
      setStartTime(new Date());
    }
  }, [quiz, timeRemaining]);

  const handleSubmitQuiz = useCallback(async () => {
    try {
      setSubmitting(true);
      const timeSpent = startTime ? Math.floor((new Date() - startTime) / 1000) : null;

      const result = await QuizService.submitQuiz({
        quizId: quiz._id,
        answers: answers,
        timeSpent: timeSpent,
        startedAt: startTime
      });

      setQuizResult(result.result);
      setShowResults(true);

      if (onQuizComplete) {
        onQuizComplete(result.result);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [quiz, answers, startTime, onQuizComplete]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmitQuiz();
    }
  }, [timeRemaining, handleSubmitQuiz]);



  const handleAnswerSelect = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = { selectedOption: optionIndex };
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };



  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / quiz.questions.length) * 100;
  };

  if (loading) {
    return (
      <Card className="text-center p-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading quiz...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
        <Button variant="outline-danger" size="sm" className="ms-2" onClick={fetchQuiz}>
          Retry
        </Button>
      </Alert>
    );
  }

  if (!quiz) {
    return <Alert variant="warning">Quiz not found.</Alert>;
  }

  const currentQuestionData = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;
  const hasAnsweredCurrent = answers[currentQuestion]?.selectedOption !== null;

  return (
    <>
      <Card className="quiz-container">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{quiz.title}</h5>
          {timeRemaining !== null && (
            <div className={`time-remaining ${timeRemaining < 300 ? 'text-danger' : ''}`}>
              Time: {formatTime(timeRemaining)}
            </div>
          )}
        </Card.Header>
        
        <Card.Body>
          <ProgressBar 
            now={getProgressPercentage()} 
            label={`${currentQuestion + 1} of ${quiz.questions.length}`}
            className="mb-4"
          />
          
          <div className="question-section">
            <h6 className="question-number">Question {currentQuestion + 1}</h6>
            <p className="question-text">{currentQuestionData.question}</p>
            
            <Form>
              {currentQuestionData.options.map((option, index) => (
                <Form.Check
                  key={index}
                  type="radio"
                  id={`option-${index}`}
                  name={`question-${currentQuestion}`}
                  label={option.text}
                  checked={answers[currentQuestion]?.selectedOption === index}
                  onChange={() => handleAnswerSelect(index)}
                  className="mb-2 quiz-option"
                />
              ))}
            </Form>
          </div>
        </Card.Body>
        
        <Card.Footer className="d-flex justify-content-between">
          <Button 
            variant="outline-secondary" 
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          
          <div>
            {!isLastQuestion ? (
              <Button 
                variant="primary" 
                onClick={handleNextQuestion}
                disabled={!hasAnsweredCurrent}
              >
                Next
              </Button>
            ) : (
              <Button 
                variant="success" 
                onClick={handleSubmitQuiz}
                disabled={!hasAnsweredCurrent || submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            )}
          </div>
        </Card.Footer>
      </Card>

      {/* Results Modal */}
      <Modal show={showResults} onHide={() => setShowResults(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Quiz Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {quizResult && (
            <div className="text-center">
              <div className={`score-display ${quizResult.passed ? 'text-success' : 'text-danger'}`}>
                <h2>{quizResult.percentage}%</h2>
                <p className="mb-1">
                  {quizResult.correctAnswers} out of {quizResult.totalQuestions} correct
                </p>
                <p className="mb-3">
                  {quizResult.passed ? '🎉 Congratulations! You passed!' : '😔 You need to score at least 70% to pass.'}
                </p>
              </div>
              
              <div className="attempt-info">
                <small className="text-muted">
                  Attempt #{quizResult.attemptNumber}
                </small>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResults(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default QuizComponent;

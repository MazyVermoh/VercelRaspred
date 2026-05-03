import { useState, useEffect } from 'react';
import questionsData from './data/questions.json';
import Menu from './components/Menu';
import Quiz from './components/Quiz';
import Results from './components/Results';

export default function App() {
  const [view, setView] = useState('menu'); // 'menu', 'quiz', 'results'
  const [knownQuestions, setKnownQuestions] = useState(() => {
    const saved = localStorage.getItem('knownQuestions');
    return saved ? JSON.parse(saved) : [];
  });
  const [weakQuestions, setWeakQuestions] = useState(() => {
    const saved = localStorage.getItem('weakQuestions');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentQuizPool, setCurrentQuizPool] = useState([]);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

  useEffect(() => {
    localStorage.setItem('knownQuestions', JSON.stringify(knownQuestions));
  }, [knownQuestions]);

  useEffect(() => {
    localStorage.setItem('weakQuestions', JSON.stringify(weakQuestions));
  }, [weakQuestions]);

  const stats = {
    total: questionsData.length,
    mastered: knownQuestions.length,
    weak: weakQuestions.length,
    unseen: questionsData.length - knownQuestions.length - weakQuestions.length
  };

  const startQuiz = (type) => {
    let pool = [];
    if (type === 'full') {
      pool = [...questionsData];
    } else if (type === 'weak') {
      pool = questionsData.filter(q => weakQuestions.includes(q.question_id));
    } else if (type === 'mastered') {
      pool = questionsData.filter(q => knownQuestions.includes(q.question_id));
    }
    
    // Shuffle the pool
    pool.sort(() => Math.random() - 0.5);
    setCurrentQuizPool(pool);
    setSessionStats({ correct: 0, incorrect: 0 });
    setView('quiz');
  };

  const handleAnswered = (question_id, isCorrect) => {
    if (isCorrect) {
      setKnownQuestions(prev => Array.from(new Set([...prev, question_id])));
      setWeakQuestions(prev => prev.filter(id => id !== question_id));
      setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setWeakQuestions(prev => Array.from(new Set([...prev, question_id])));
      setKnownQuestions(prev => prev.filter(id => id !== question_id));
      setSessionStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
  };

  const resetProgress = () => {
    if(window.confirm('Вы уверены, что хотите сбросить весь прогресс?')) {
      setKnownQuestions([]);
      setWeakQuestions([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-emerald-500/30">
      {view === 'menu' && (
        <Menu 
          stats={stats} 
          onStartFull={() => startQuiz('full')}
          onPracticeWeak={() => startQuiz('weak')}
          onReviewMastered={() => startQuiz('mastered')}
          onReset={resetProgress}
        />
      )}
      {view === 'quiz' && (
        <Quiz 
          questions={currentQuizPool}
          onComplete={() => setView('results')}
          onQuit={() => setView('menu')}
          onAnswered={handleAnswered}
        />
      )}
      {view === 'results' && (
        <Results 
          sessionStats={sessionStats}
          onReturnMenu={() => setView('menu')}
          onRetryWeak={() => startQuiz('weak')}
          hasWeak={weakQuestions.length > 0}
        />
      )}
    </div>
  );
}

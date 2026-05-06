import { useState, useEffect } from 'react';
import questionsData from './data/questions.json';
import Menu from './components/Menu';
import Quiz from './components/Quiz';
import Results from './components/Results';
import StudyList from './components/StudyList';

export default function App() {
  const [view, setView] = useState('menu');
  const [knownQuestions, setKnownQuestions] = useState([]);
  const [weakQuestions, setWeakQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [currentQuizPool, setCurrentQuizPool] = useState([]);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });
  const [isFullQuiz, setIsFullQuiz] = useState(false);

  useEffect(() => {
    fetch('/api/progress')
      .then(res => res.json())
      .then(data => {
        if (data.knownQuestions) setKnownQuestions(data.knownQuestions);
        if (data.weakQuestions) setWeakQuestions(data.weakQuestions);
        if (data.currentIndex !== undefined) setCurrentIndex(data.currentIndex);
        setIsLoading(false);
      })
      .catch(() => {
        const savedKnown = localStorage.getItem('knownQuestions');
        if (savedKnown) setKnownQuestions(JSON.parse(savedKnown));
        const savedWeak = localStorage.getItem('weakQuestions');
        if (savedWeak) setWeakQuestions(JSON.parse(savedWeak));
        const savedIdx = localStorage.getItem('currentIndex');
        if (savedIdx) setCurrentIndex(parseInt(savedIdx));
        setIsLoading(false);
      });
  }, []);

  const saveProgress = (known, weak, idx) => {
    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ knownQuestions: known, weakQuestions: weak, currentIndex: idx })
    }).catch(() => {
      localStorage.setItem('knownQuestions', JSON.stringify(known));
      localStorage.setItem('weakQuestions', JSON.stringify(weak));
      localStorage.setItem('currentIndex', idx.toString());
    });
  };

  if (isLoading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">Загрузка...</div>;

  const stats = {
    total: questionsData.length,
    mastered: knownQuestions.length,
    weak: weakQuestions.length,
    unseen: questionsData.length - knownQuestions.length - weakQuestions.length
  };

  const startQuiz = (type) => {
    let pool = [];
    let full = false;
    if (type === 'full' || type === 'resume') {
      pool = [...questionsData];
      full = true;
    } else if (type === 'weak') {
      pool = questionsData.filter(q => weakQuestions.includes(q.question_id));
      pool.sort(() => Math.random() - 0.5);
    } else if (type === 'mastered') {
      pool = questionsData.filter(q => knownQuestions.includes(q.question_id));
      pool.sort(() => Math.random() - 0.5);
    }
    
    setIsFullQuiz(full);
    setCurrentQuizPool(pool);
    setSessionStats({ correct: 0, incorrect: 0 });
    setView('quiz');
  };

  const handleAnswered = (question_id, isCorrect, newIndex) => {
    let newKnown = [...knownQuestions];
    let newWeak = [...weakQuestions];
    
    if (isCorrect) {
      if (!newKnown.includes(question_id)) newKnown.push(question_id);
      newWeak = newWeak.filter(id => id !== question_id);
      setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      if (!newWeak.includes(question_id)) newWeak.push(question_id);
      newKnown = newKnown.filter(id => id !== question_id);
      setSessionStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
    
    setKnownQuestions(newKnown);
    setWeakQuestions(newWeak);
    if (isFullQuiz && newIndex !== undefined) {
      setCurrentIndex(newIndex);
    }
    
    saveProgress(newKnown, newWeak, isFullQuiz ? newIndex : currentIndex);
  };

  const resetProgress = () => {
    if(window.confirm('Вы уверены, что хотите сбросить весь прогресс?')) {
      setKnownQuestions([]);
      setWeakQuestions([]);
      setCurrentIndex(0);
      saveProgress([], [], 0);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-emerald-500/30">
      {view === 'menu' && (
        <Menu 
          stats={stats} 
          hasSavedState={currentIndex > 0 && currentIndex < questionsData.length - 1}
          onStartFull={() => { setCurrentIndex(0); startQuiz('full'); }}
          onResumeFull={() => startQuiz('resume')}
          onPracticeWeak={() => startQuiz('weak')}
          onReviewMastered={() => startQuiz('mastered')}
          onStudyList={() => setView('studyList')}
          onReset={resetProgress}
        />
      )}
      {view === 'quiz' && (
        <Quiz 
          questions={currentQuizPool}
          initialIndex={isFullQuiz ? currentIndex : 0}
          isFullQuiz={isFullQuiz}
          knownQuestions={knownQuestions}
          weakQuestions={weakQuestions}
          onComplete={() => setView('results')}
          onQuit={() => setView('menu')}
          onAnswered={handleAnswered}
          onIndexChange={(idx) => {
            if (isFullQuiz) {
              setCurrentIndex(idx);
              saveProgress(knownQuestions, weakQuestions, idx);
            }
          }}
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
      {view === 'studyList' && (
        <StudyList onBack={() => setView('menu')} />
      )}
    </div>
  );
}

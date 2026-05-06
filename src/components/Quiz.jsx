import { useState, useEffect } from 'react';
import { LogOut, ArrowRight, CheckCircle2, XCircle, LayoutGrid, X } from 'lucide-react';

export default function Quiz({ questions, initialIndex = 0, isFullQuiz, knownQuestions, weakQuestions, onComplete, onQuit, onAnswered, onIndexChange }) {
  const [localIndex, setLocalIndex] = useState(initialIndex);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [showNav, setShowNav] = useState(false);
  
  const question = questions[localIndex];
  
  const isAnsweredGlobal = isFullQuiz ? (knownQuestions.includes(question?.question_id) || weakQuestions.includes(question?.question_id)) : false;
  const isAnsweredThisSession = selectedOptionId !== null;
  const isAnswered = isAnsweredThisSession || isAnsweredGlobal;

  useEffect(() => {
    setSelectedOptionId(null);
    window.scrollTo(0, 0);
  }, [localIndex]);

  if (!questions || questions.length === 0) return null;

  const handleOptionClick = (optionId) => {
    if (isAnswered) return;
    
    setSelectedOptionId(optionId);
    const isCorrect = optionId === question.correct_option_id;
    onAnswered(question.question_id, isCorrect, localIndex);
  };

  const handleNext = () => {
    if (localIndex < questions.length - 1) {
      const nextIdx = localIndex + 1;
      setLocalIndex(nextIdx);
      if (onIndexChange) onIndexChange(nextIdx);
    } else {
      onComplete();
    }
  };

  const jumpTo = (idx) => {
    setLocalIndex(idx);
    setShowNav(false);
    if (onIndexChange) onIndexChange(idx);
  }

  const progress = ((localIndex) / questions.length) * 100;

  const getGlobalSelectedId = () => {
    if (isAnsweredThisSession) return selectedOptionId;
    if (isAnsweredGlobal) return question.correct_option_id; 
    return null;
  };
  const displaySelectedId = getGlobalSelectedId();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 min-h-screen flex flex-col pt-8 relative">
      {/* Nav Overlay */}
      {showNav && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setShowNav(false)} />
          <div className="relative w-full max-w-sm bg-slate-800 h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800 z-10 sticky top-0">
              <h3 className="font-bold text-lg text-slate-100">Навигация</h3>
              <button onClick={() => setShowNav(false)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-100"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-4 overflow-y-auto grid grid-cols-5 gap-2 content-start pb-20">
              {questions.map((q, idx) => {
                const isKnown = knownQuestions.includes(q.question_id);
                const isWeak = weakQuestions.includes(q.question_id);
                const isCurrent = idx === localIndex;
                let bg = "bg-slate-700 text-slate-300 hover:bg-slate-600";
                if (isKnown) bg = "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
                else if (isWeak) bg = "bg-rose-500/20 text-rose-400 border border-rose-500/30";
                if (isCurrent) bg += " ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-800";
                
                return (
                  <button key={q.question_id} onClick={() => jumpTo(idx)} className={`h-12 rounded-lg font-medium text-sm flex items-center justify-center transition-all ${bg}`}>
                    {idx + 1}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8 bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/50">
        <button 
          onClick={onQuit}
          className="flex items-center gap-2 text-slate-400 hover:text-rose-400 transition-colors font-medium px-2 py-1 rounded-lg hover:bg-slate-800"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden sm:inline">В меню</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="text-slate-300 font-semibold bg-slate-900/50 px-4 py-2 rounded-xl">
            Вопрос {localIndex + 1} из {questions.length}
          </div>
          <button onClick={() => setShowNav(true)} className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl transition-colors">
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="w-full h-3 bg-slate-800 rounded-full mb-10 overflow-hidden shadow-inner border border-slate-700/50">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-grow flex flex-col">
        <div className="bg-slate-800/30 p-6 md:p-8 rounded-3xl border border-slate-700/50 shadow-lg mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-50 leading-relaxed">
            {question.text}
          </h2>
        </div>

        <div className="grid gap-4">
          {question.options.map(option => {
            const isSelected = displaySelectedId === option.id;
            const isCorrectOption = option.id === question.correct_option_id;
            
            let cardClasses = "relative p-5 md:p-6 rounded-2xl border-2 text-left transition-all duration-300 overflow-hidden group shadow-md ";
            let textClasses = "text-lg md:text-xl relative z-10 transition-colors duration-300 ";
            let icon = null;

            if (!isAnswered) {
              cardClasses += "bg-slate-800/80 border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800 cursor-pointer hover:shadow-emerald-500/5 hover:-translate-y-0.5";
              textClasses += "text-slate-300 group-hover:text-slate-100";
            } else {
              cardClasses += "cursor-default ";
              if (isAnsweredGlobal && !isAnsweredThisSession) {
                  if (isCorrectOption) {
                      cardClasses += "bg-emerald-500/20 border-emerald-500 shadow-emerald-500/20";
                      textClasses += "text-emerald-50 font-semibold";
                      icon = <CheckCircle2 className="w-7 h-7 text-emerald-400 absolute right-6 top-1/2 -translate-y-1/2 drop-shadow-md" />;
                  } else {
                      cardClasses += "bg-slate-900/50 border-slate-800 opacity-40";
                      textClasses += "text-slate-500";
                  }
              } else {
                  if (isCorrectOption) {
                    cardClasses += "bg-emerald-500/20 border-emerald-500 shadow-emerald-500/20 scale-[1.01]";
                    textClasses += "text-emerald-50 font-semibold";
                    icon = <CheckCircle2 className="w-7 h-7 text-emerald-400 absolute right-6 top-1/2 -translate-y-1/2 drop-shadow-md" />;
                  } else if (isSelected && !isCorrectOption) {
                    cardClasses += "bg-rose-500/20 border-rose-500 shadow-rose-500/20";
                    textClasses += "text-rose-50 font-semibold";
                    icon = <XCircle className="w-7 h-7 text-rose-400 absolute right-6 top-1/2 -translate-y-1/2 drop-shadow-md" />;
                  } else {
                    cardClasses += "bg-slate-900/50 border-slate-800 opacity-40";
                    textClasses += "text-slate-500";
                  }
              }
            }

            return (
              <button 
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className={cardClasses}
                disabled={isAnswered}
              >
                <div className={`pr-12 ${textClasses}`}>
                  {option.text}
                </div>
                {icon}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 h-20 flex items-end justify-end">
        {isAnswered && (
          <button
            onClick={handleNext}
            className="flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-2xl font-bold text-lg transition-all hover:scale-[1.03] active:scale-[0.97] shadow-xl shadow-emerald-500/20 animate-in fade-in slide-in-from-bottom-4 duration-300"
          >
            {localIndex < questions.length - 1 ? 'Следующий вопрос' : 'Завершить экзамен'}
            <ArrowRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
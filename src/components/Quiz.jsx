import { useState, useEffect } from 'react';
import { LogOut, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

export default function Quiz({ questions, onComplete, onQuit, onAnswered }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  
  const question = questions[currentIndex];
  const isAnswered = selectedOptionId !== null;

  useEffect(() => {
    setSelectedOptionId(null);
    window.scrollTo(0, 0);
  }, [currentIndex]);

  if (!questions || questions.length === 0) return null;

  const handleOptionClick = (optionId) => {
    if (isAnswered) return;
    
    setSelectedOptionId(optionId);
    const isCorrect = optionId === question.correct_option_id;
    onAnswered(question.question_id, isCorrect);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 min-h-screen flex flex-col pt-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8 bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/50">
        <button 
          onClick={onQuit}
          className="flex items-center gap-2 text-slate-400 hover:text-rose-400 transition-colors font-medium px-2 py-1 rounded-lg hover:bg-slate-800"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden sm:inline">Выйти в меню</span>
        </button>
        <div className="text-slate-300 font-semibold bg-slate-900/50 px-4 py-2 rounded-xl">
          Вопрос {currentIndex + 1} из {questions.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-slate-800 rounded-full mb-10 overflow-hidden shadow-inner border border-slate-700/50">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="flex-grow flex flex-col">
        <div className="bg-slate-800/30 p-6 md:p-8 rounded-3xl border border-slate-700/50 shadow-lg mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-50 leading-relaxed">
            {question.text}
          </h2>
        </div>

        {/* Options */}
        <div className="grid gap-4">
          {question.options.map(option => {
            const isSelected = selectedOptionId === option.id;
            const isCorrectOption = option.id === question.correct_option_id;
            
            let cardClasses = "relative p-5 md:p-6 rounded-2xl border-2 text-left transition-all duration-300 overflow-hidden group shadow-md ";
            let textClasses = "text-lg md:text-xl relative z-10 transition-colors duration-300 ";
            let icon = null;

            if (!isAnswered) {
              cardClasses += "bg-slate-800/80 border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800 cursor-pointer hover:shadow-emerald-500/5 hover:-translate-y-0.5";
              textClasses += "text-slate-300 group-hover:text-slate-100";
            } else {
              cardClasses += "cursor-default ";
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

      {/* Next Button Container */}
      <div className="mt-10 h-20 flex items-end justify-end">
        {isAnswered && (
          <button
            onClick={handleNext}
            className="flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-2xl font-bold text-lg transition-all hover:scale-[1.03] active:scale-[0.97] shadow-xl shadow-emerald-500/20 animate-in fade-in slide-in-from-bottom-4 duration-300"
          >
            {currentIndex < questions.length - 1 ? 'Следующий вопрос' : 'Завершить экзамен'}
            <ArrowRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}

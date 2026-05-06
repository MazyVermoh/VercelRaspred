import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import questionsData from '../data/questions.json';

export default function StudyList({ onBack }) {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pt-8 pb-20">
      <div className="flex items-center justify-between mb-8 bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/50 sticky top-4 z-50">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Назад в меню</span>
        </button>
        <div className="text-slate-300 font-semibold bg-slate-900/50 px-4 py-2 rounded-xl hidden sm:block">
          Все вопросы ({questionsData.length})
        </div>
      </div>

      <div className="space-y-8">
        {questionsData.map((q, i) => (
          <div key={q.question_id} className="bg-slate-800/30 p-6 md:p-8 rounded-3xl border border-slate-700/50 shadow-lg">
            <h3 className="text-xl font-semibold text-slate-50 mb-6 flex gap-4">
              <span className="text-emerald-500/50 shrink-0">{i + 1}.</span>
              <span>{q.text}</span>
            </h3>
            <div className="grid gap-3 pl-0 md:pl-10">
              {q.options.map(opt => {
                const isCorrect = opt.id === q.correct_option_id;
                return (
                  <div 
                    key={opt.id} 
                    className={`relative p-4 rounded-xl border ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-900/50 border-slate-800/50 opacity-60'}`}
                  >
                    <div className={`pr-10 ${isCorrect ? 'text-emerald-50 font-medium' : 'text-slate-400'}`}>
                      {opt.text}
                    </div>
                    {isCorrect && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

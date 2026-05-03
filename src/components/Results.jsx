import { Target, Home, Award, Percent } from 'lucide-react';

export default function Results({ sessionStats, onReturnMenu, onRetryWeak, hasWeak }) {
  const total = sessionStats.correct + sessionStats.incorrect;
  const accuracy = total > 0 ? Math.round((sessionStats.correct / total) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto p-6 pt-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-6 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full mb-8 relative shadow-[0_0_60px_rgba(16,185,129,0.2)]">
          <Award className="w-20 h-20 text-emerald-400 relative z-10 drop-shadow-lg" />
        </div>
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 mb-4 tracking-tight">Сессия завершена</h2>
        <p className="text-slate-400 text-xl font-medium">Отличная работа! Вот ваши результаты.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 text-center shadow-xl">
          <div className="flex justify-center mb-4">
            <Percent className="w-8 h-8 text-cyan-400" />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">Точность</p>
          <p className="text-5xl font-black text-slate-100">{accuracy}%</p>
        </div>
        <div className="bg-emerald-500/10 backdrop-blur-sm p-8 rounded-3xl border border-emerald-500/20 text-center shadow-xl">
          <div className="flex justify-center mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 font-bold">✓</div>
          </div>
          <p className="text-emerald-400/80 text-sm font-medium mb-2 uppercase tracking-wider">Верно</p>
          <p className="text-5xl font-black text-emerald-400">{sessionStats.correct}</p>
        </div>
        <div className="bg-rose-500/10 backdrop-blur-sm p-8 rounded-3xl border border-rose-500/20 text-center shadow-xl">
          <div className="flex justify-center mb-4">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center text-rose-400 font-bold">✕</div>
          </div>
          <p className="text-rose-400/80 text-sm font-medium mb-2 uppercase tracking-wider">Ошибок</p>
          <p className="text-5xl font-black text-rose-400">{sessionStats.incorrect}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 max-w-md mx-auto">
        {hasWeak && sessionStats.incorrect > 0 && (
          <button 
            onClick={onRetryWeak}
            className="flex items-center justify-center gap-3 p-5 bg-slate-800 hover:bg-slate-700 border border-rose-500/30 text-rose-400 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            <Target className="w-6 h-6" />
            Повторить слабые места
          </button>
        )}
        
        <button 
          onClick={onReturnMenu}
          className="flex items-center justify-center gap-3 p-5 bg-gradient-to-r from-slate-200 to-slate-100 hover:from-white hover:to-slate-200 text-slate-900 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-slate-100/10"
        >
          <Home className="w-6 h-6" />
          Вернуться в главное меню
        </button>
      </div>
    </div>
  );
}

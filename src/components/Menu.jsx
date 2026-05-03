import { Brain, Play, RotateCcw, Target, BookOpen, Trash2 } from 'lucide-react';

export default function Menu({ stats, onStartFull, onPracticeWeak, onReviewMastered, onReset }) {
  return (
    <div className="max-w-4xl mx-auto p-6 pt-12 md:pt-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-2xl mb-6 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
          <Brain className="w-12 h-12 text-emerald-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
          Quiz Simulator
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto font-medium">
          Освойте материал с помощью интервального повторения и целевой проработки слабых мест.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 shadow-xl transition-transform hover:-translate-y-1">
          <p className="text-slate-400 text-sm font-medium mb-1">Всего вопросов</p>
          <p className="text-4xl font-bold text-slate-100">{stats.total}</p>
        </div>
        <div className="bg-emerald-500/10 backdrop-blur-sm p-6 rounded-2xl border border-emerald-500/20 shadow-xl transition-transform hover:-translate-y-1">
          <p className="text-emerald-400/80 text-sm font-medium mb-1">Изучено</p>
          <p className="text-4xl font-bold text-emerald-400">{stats.mastered}</p>
        </div>
        <div className="bg-rose-500/10 backdrop-blur-sm p-6 rounded-2xl border border-rose-500/20 shadow-xl transition-transform hover:-translate-y-1">
          <p className="text-rose-400/80 text-sm font-medium mb-1">Слабые места</p>
          <p className="text-4xl font-bold text-rose-400">{stats.weak}</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 shadow-xl transition-transform hover:-translate-y-1">
          <p className="text-slate-400 text-sm font-medium mb-1">Не пройдено</p>
          <p className="text-4xl font-bold text-slate-300">{stats.unseen}</p>
        </div>
      </div>

      <div className="grid gap-4 max-w-md mx-auto">
        <button 
          onClick={onStartFull}
          className="group flex items-center justify-between p-4 md:p-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-900 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20"
        >
          <span className="flex items-center gap-3">
            <Play className="w-6 h-6 fill-slate-900" /> Начать полный экзамен
          </span>
          <span className="bg-slate-900/10 px-3 py-1 rounded-lg text-sm">{stats.total}</span>
        </button>

        {stats.weak > 0 && (
          <button 
            onClick={onPracticeWeak}
            className="flex items-center justify-between p-4 md:p-5 bg-slate-800 hover:bg-slate-700 border border-rose-500/30 text-rose-400 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-rose-500/5"
          >
            <span className="flex items-center gap-3">
              <Target className="w-6 h-6" /> Слабые места
            </span>
            <span className="bg-rose-500/10 px-3 py-1 rounded-lg text-sm">{stats.weak}</span>
          </button>
        )}

        {stats.mastered > 0 && (
          <button 
            onClick={onReviewMastered}
            className="flex items-center justify-between p-4 md:p-5 bg-slate-800 hover:bg-slate-700 border border-emerald-500/30 text-emerald-400 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/5"
          >
            <span className="flex items-center gap-3">
              <BookOpen className="w-6 h-6" /> Повторить изученное
            </span>
            <span className="bg-emerald-500/10 px-3 py-1 rounded-lg text-sm">{stats.mastered}</span>
          </button>
        )}

        {(stats.mastered > 0 || stats.weak > 0) && (
          <button 
            onClick={onReset}
            className="flex items-center justify-center p-4 mt-6 text-slate-500 hover:text-rose-400 rounded-xl font-medium transition-colors hover:bg-slate-800/50"
          >
            <span className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Сбросить прогресс
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

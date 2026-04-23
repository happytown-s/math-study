import { useState, useMemo } from 'react'
import questions from '../data/math-exam.json'
import type { StatEntry } from '../App'

type Mode = 'drill' | 'exam' | 'review'

interface Props {
  stats: Record<string, StatEntry>
  updateStats: (key: string, correct: boolean) => void
}

interface Question {
  category: string
  question: string
  options: { text: string; correct: boolean }[]
  explanation: string
}

const categoryNames: Record<string, string> = {
  'Arithmetic': '算数',
  'Algebra': '代数',
  'Geometry': '幾何',
  'Statistics': '統計',
  'Logic & Reasoning': '論理と推論',
  'Word Problems': '文章題',
  'Number Theory': '整数論',
  'Graphs & Functions': 'グラフと関数',
  'Trigonometry': '三角法',
  'Applied Math': '応用数学',
}

const EXAM_SIZE = 20
const categories = [...new Set((questions as Question[]).map(q => q.category))].sort()

export default function Quiz({ stats, updateStats }: Props) {
  const [category, setCategory] = useState<string>('All')
  const [mode, setMode] = useState<Mode>('drill')
  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [examQuestions, setExamQuestions] = useState<Question[]>([])
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 })
  const [started, setStarted] = useState(false)

  const filtered = useMemo(() => {
    const qs = questions as Question[]
    return category === 'All' ? qs : qs.filter(q => q.category === category)
  }, [category])

  const q: Question | null = mode === 'exam' ? (examQuestions[currentQ] ?? null) : (filtered[0] ?? null)

  const shuffleExam = () => {
    const pool = category === 'All' ? [...(questions as Question[])] : (questions as Question[]).filter(q => q.category === category)
    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, Math.min(EXAM_SIZE, pool.length))
    setExamQuestions(shuffled)
    setSessionScore({ correct: 0, total: 0 })
    setCurrentQ(0)
    setShowAnswer(false)
    setSelectedIdx(null)
    setStarted(true)
  }

  const startDrill = () => {
    const shuffled = [...filtered].sort(() => Math.random() - 0.5)
    setExamQuestions(shuffled)
    setSessionScore({ correct: 0, total: 0 })
    setCurrentQ(0)
    setShowAnswer(false)
    setSelectedIdx(null)
    setStarted(true)
  }

  const handleSelect = (idx: number) => {
    if (showAnswer || !q) return
    setSelectedIdx(idx)
    setShowAnswer(true)
    const correct = q.options[idx].correct
    setSessionScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }))
    updateStats(q.category, correct)
  }

  const next = () => {
    if (mode === 'exam' && currentQ >= examQuestions.length - 1) return
    setShowAnswer(false)
    setSelectedIdx(null)
    setCurrentQ(prev => prev + 1)
  }

  const getAccuracy = (cat: string) => {
    const s = stats[cat]
    if (!s || s.total === 0) return null
    return Math.round((s.correct / s.total) * 100)
  }

  const getCategoryColor = (cat: string) => {
    const acc = getAccuracy(cat)
    if (acc === null) return 'text-gray-500'
    if (acc >= 80) return 'text-green-400'
    if (acc >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const catLabel = (cat: string) => categoryNames[cat] || cat

  if (!started) {
    return (
      <div className="space-y-6">
        <div className="bg-dark-800 rounded-xl p-6 border border-purple-900/30">
          <h2 className="text-lg font-semibold text-purple-300 mb-4">カテゴリ</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory('All')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                category === 'All'
                  ? 'bg-purple-700 text-white'
                  : 'bg-dark-600 text-gray-400 hover:text-white'
              }`}
            >
              全カテゴリ ({(questions as Question[]).length})
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  category === cat
                    ? 'bg-purple-700 text-white'
                    : 'bg-dark-600 text-gray-400 hover:text-white'
                }`}
              >
                <span className={getCategoryColor(cat)}>{catLabel(cat)}</span>
                <span className="text-gray-600 ml-1">
                  ({(questions as Question[]).filter(q => q.category === cat).length})
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-dark-800 rounded-xl p-6 border border-purple-900/30">
          <h2 className="text-lg font-semibold text-purple-300 mb-4">モード</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => { setMode('drill'); startDrill() }}
              className="bg-dark-600 hover:bg-dark-500 border border-purple-900/30 rounded-xl p-4 text-left transition-all hover:border-purple-600"
            >
              <div className="text-purple-400 font-semibold mb-1">ドリル</div>
              <div className="text-sm text-gray-400">1問ずつ練習。即時フィードバック。</div>
            </button>
            <button
              onClick={() => { setMode('exam'); shuffleExam() }}
              className="bg-dark-600 hover:bg-dark-500 border border-purple-900/30 rounded-xl p-4 text-left transition-all hover:border-purple-600"
            >
              <div className="text-purple-400 font-semibold mb-1">模擬試験</div>
              <div className="text-sm text-gray-400">{EXAM_SIZE}問ランダム出題。スコア記録。</div>
            </button>
            <button
              onClick={() => { setMode('review'); setStarted(true) }}
              className="bg-dark-600 hover:bg-dark-500 border border-purple-900/30 rounded-xl p-4 text-left transition-all hover:border-purple-600"
            >
              <div className="text-purple-400 font-semibold mb-1">復習</div>
              <div className="text-sm text-gray-400">解説付きで問題を閲覧。採点なし。</div>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!q) {
    return (
      <div className="text-center py-12 text-gray-500">
        問題がありません。
        <button onClick={() => setStarted(false)} className="block mx-auto mt-4 text-purple-400 hover:text-purple-300">
          戻る
        </button>
      </div>
    )
  }

  const isExamDone = mode === 'exam' && showAnswer && currentQ >= examQuestions.length - 1

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStarted(false)}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          &larr; 戻る
        </button>
        <div className="flex items-center gap-3 text-sm">
          {mode !== 'review' && (
            <span className="text-gray-400">
              スコア: <span className="text-purple-400 font-semibold">{sessionScore.correct}/{sessionScore.total}</span>
            </span>
          )}
          {mode === 'exam' && (
            <span className="text-gray-500">
              {currentQ + 1}/{examQuestions.length}
            </span>
          )}
          <span className="bg-dark-600 px-2 py-0.5 rounded text-purple-300 text-xs">{catLabel(q.category)}</span>
        </div>
      </div>

      <div className="bg-dark-800 rounded-xl p-6 border border-purple-900/30">
        <p className="text-lg leading-relaxed mb-6">{q.question}</p>
        <div className="space-y-2">
          {q.options.map((opt, idx) => {
            let bg = 'bg-dark-600 hover:bg-dark-500 border-transparent'
            if (showAnswer) {
              if (opt.correct) bg = 'bg-green-900/40 border-green-600'
              else if (idx === selectedIdx) bg = 'bg-red-900/40 border-red-600'
              else bg = 'bg-dark-700 border-transparent opacity-50'
            }
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={showAnswer}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${bg} ${
                  !showAnswer ? 'cursor-pointer hover:border-purple-600' : 'cursor-default'
                }`}
              >
                <span className="text-sm font-medium">
                  <span className="text-gray-500 mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {opt.text}
                  {showAnswer && opt.correct && <span className="text-green-400 ml-2"> (正解)</span>}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {showAnswer && (
        <div className="bg-dark-700 rounded-xl p-5 border border-purple-900/20">
          <div className="text-sm font-semibold text-purple-400 mb-2">解説</div>
          <p className="text-gray-300 text-sm leading-relaxed">{q.explanation}</p>
        </div>
      )}

      {isExamDone && (
        <div className="bg-dark-800 rounded-xl p-6 border border-purple-700/50 text-center">
          <div className="text-2xl font-bold text-purple-400 mb-2">試験完了</div>
          <div className="text-4xl font-bold mb-2">
            {Math.round((sessionScore.correct / sessionScore.total) * 100)}%
          </div>
          <div className="text-gray-400 mb-4">
            {sessionScore.correct} / {sessionScore.total} 問正解
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setMode('exam'); shuffleExam() }}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg text-sm font-medium transition-colors"
            >
              再挑戦
            </button>
            <button
              onClick={() => setStarted(false)}
              className="px-4 py-2 bg-dark-600 hover:bg-dark-500 rounded-lg text-sm font-medium transition-colors"
            >
              メニューに戻る
            </button>
          </div>
        </div>
      )}

      {showAnswer && !isExamDone && (
        <div className="flex justify-end">
          <button
            onClick={next}
            className="px-6 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg font-medium transition-colors"
          >
            次へ &rarr;
          </button>
        </div>
      )}

      {mode === 'review' && showAnswer && (
        <div className="flex justify-between">
          <button
            onClick={() => { setCurrentQ(Math.max(0, currentQ - 1)); setShowAnswer(true); setSelectedIdx(-1); }}
            disabled={currentQ === 0}
            className="px-4 py-2 bg-dark-600 hover:bg-dark-500 rounded-lg text-sm disabled:opacity-30 transition-colors"
          >
            &larr; 前へ
          </button>
          <button
            onClick={() => {
              if (currentQ < filtered.length - 1) {
                setCurrentQ(currentQ + 1)
                setShowAnswer(true)
                setSelectedIdx(-1)
              }
            }}
            disabled={currentQ >= filtered.length - 1}
            className="px-4 py-2 bg-dark-600 hover:bg-dark-500 rounded-lg text-sm disabled:opacity-30 transition-colors"
          >
            次へ &rarr;
          </button>
        </div>
      )}
    </div>
  )
}

import { useState, useMemo } from 'react'
import problems from '../data/calc-training.json'
import type { StatEntry } from '../App'

interface Props {
  stats: Record<string, StatEntry>
  updateStats: (key: string, correct: boolean) => void
}

interface Problem {
  category: string
  title: string
  problem: string
  cheatsheet: string
  workedExample: string
  steps: string[]
  answer: string
}

const categoryNames: Record<string, string> = {
  'Mental Math': '暗算',
  'Percentage Calculations': '百分率計算',
  'Speed/Rate Problems': '速さ・割合問題',
  'Probability & Counting': '確率と数え上げ',
  'Geometry Calculations': '幾何計算',
  'Algebraic Manipulation': '代数操作',
  'Financial Math': '金融数学',
  'Unit Conversions': '単位変換',
}

const categories = [...new Set((problems as Problem[]).map(p => p.category))].sort()

type View = 'menu' | 'solve' | 'learn'

export default function CalcTraining({ stats, updateStats }: Props) {
  const [category, setCategory] = useState<string>(categories[0] ?? 'Mental Math')
  const [view, setView] = useState<View>('menu')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showAllSteps, setShowAllSteps] = useState(false)

  const filtered = useMemo(() => {
    return (problems as Problem[]).filter(p => p.category === category)
  }, [category])

  const current = filtered[currentIndex]

  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9.]/g, '').trim()

  const checkAnswer = () => {
    if (!current) return
    const correct = normalize(current.answer) === normalize(userAnswer)
    setIsCorrect(correct)
    setShowResult(true)
    updateStats(category, correct)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showResult) checkAnswer()
  }

  const nextProblem = () => {
    setShowResult(false)
    setShowAllSteps(false)
    setUserAnswer('')
    setIsCorrect(false)
    if (currentIndex < filtered.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(0)
    }
  }

  const goTo = (idx: number) => {
    setCurrentIndex(idx)
    setView('solve')
    setShowResult(false)
    setShowAllSteps(false)
    setUserAnswer('')
  }

  const catLabel = (cat: string) => categoryNames[cat] || cat

  if (view === 'menu') {
    return (
      <div className="space-y-4">
        <div className="bg-dark-800 rounded-xl p-6 border border-purple-900/30">
          <h2 className="text-lg font-semibold text-purple-300 mb-4">トピック選択</h2>
          <div className="flex flex-wrap gap-2 mb-6">
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
                {catLabel(cat)}
                <span className="text-gray-600 ml-1">({(problems as Problem[]).filter(p => p.category === cat).length})</span>
              </button>
            ))}
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => { setCurrentIndex(0); setView('solve'); setShowResult(false); setShowAllSteps(false); setUserAnswer('') }}
              className="flex-1 px-4 py-3 bg-purple-700 hover:bg-purple-600 rounded-xl font-medium transition-colors"
            >
              練習モード
            </button>
            <button
              onClick={() => { setCurrentIndex(0); setView('learn') }}
              className="flex-1 px-4 py-3 bg-dark-600 hover:bg-dark-500 border border-purple-900/30 rounded-xl font-medium transition-colors"
            >
              学習 / 参考資料
            </button>
          </div>

          <div className="border-t border-purple-900/20 pt-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">このトピックの問題</h3>
            <div className="grid gap-2">
              {filtered.map((p, i) => {
                const s = stats[category]
                const acc = s && s.total > 0 ? Math.round((s.correct / s.total) * 100) : null
                return (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="text-left px-4 py-3 bg-dark-600 hover:bg-dark-500 rounded-lg transition-all border border-transparent hover:border-purple-900/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{i + 1}. {p.title}</span>
                      {acc !== null && (
                        <span className={`text-xs font-medium ${acc >= 80 ? 'text-green-400' : acc >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {acc}%
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{p.problem}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'learn') {
    return (
      <div className="space-y-4">
        <button onClick={() => setView('menu')} className="text-sm text-gray-400 hover:text-white transition-colors">
          &larr; メニューに戻る
        </button>
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {filtered.map((_p, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`shrink-0 px-3 py-1 rounded-lg text-xs transition-all ${
                i === currentIndex ? 'bg-purple-700 text-white' : 'bg-dark-600 text-gray-400'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        {current && (
          <div className="bg-dark-800 rounded-xl p-6 border border-purple-900/30 space-y-5">
            <div>
              <div className="text-xs text-purple-400 font-medium uppercase tracking-wider mb-1">{catLabel(current.category)}</div>
              <h2 className="text-xl font-bold text-white">{current.title}</h2>
            </div>

            <div className="bg-dark-700 rounded-lg p-4 border border-purple-900/20">
              <div className="text-sm font-semibold text-purple-400 mb-2">チートシート</div>
              <p className="text-gray-300 text-sm leading-relaxed">{current.cheatsheet}</p>
            </div>

            <div>
              <div className="text-sm font-semibold text-purple-400 mb-2">問題</div>
              <p className="text-white text-lg">{current.problem}</p>
            </div>

            <div className="bg-dark-700 rounded-lg p-4 border border-purple-900/20">
              <div className="text-sm font-semibold text-purple-400 mb-2">例題</div>
              <p className="text-gray-300 text-sm leading-relaxed">{current.workedExample}</p>
            </div>

            <div>
              <div className="text-sm font-semibold text-purple-400 mb-3">ステップバイステップ解法</div>
              <div className="space-y-2">
                {current.steps.map((step, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="shrink-0 w-6 h-6 bg-purple-800 rounded-full flex items-center justify-center text-xs font-bold text-purple-200">
                      {i + 1}
                    </span>
                    <p className="text-gray-300 text-sm pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-900/20 rounded-lg p-4 border border-green-800/30">
              <div className="text-sm font-semibold text-green-400 mb-1">解答</div>
              <p className="text-green-300 text-lg font-semibold">{current.answer}</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Solve mode
  if (!current) {
    return (
      <div className="text-center py-12 text-gray-500">
        このカテゴリには問題がありません。
        <button onClick={() => setView('menu')} className="block mx-auto mt-4 text-purple-400 hover:text-purple-300">
          戻る
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => setView('menu')} className="text-sm text-gray-400 hover:text-white transition-colors">
          &larr; 戻る
        </button>
        <div className="flex items-center gap-3">
          <span className="bg-dark-600 px-2 py-0.5 rounded text-purple-300 text-xs">{catLabel(current.category)}</span>
          <span className="text-gray-500 text-sm">{currentIndex + 1}/{filtered.length}</span>
        </div>
      </div>

      <div className="bg-dark-800 rounded-xl p-6 border border-purple-900/30">
        <div className="text-sm text-purple-400 mb-2">{current.title}</div>
        <p className="text-xl font-semibold text-white mb-1">{current.problem}</p>
        {current.cheatsheet && (
          <details className="mt-3 text-sm">
            <summary className="text-gray-500 cursor-pointer hover:text-purple-400 transition-colors">
              ヒント / チートシートを表示
            </summary>
            <p className="mt-2 text-gray-400 bg-dark-700 p-3 rounded-lg">{current.cheatsheet}</p>
          </details>
        )}
      </div>

      {!showResult ? (
        <div className="bg-dark-800 rounded-xl p-6 border border-purple-900/30">
          <div className="flex gap-3">
            <input
              type="text"
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="回答を入力..."
              className="flex-1 bg-dark-600 border border-purple-900/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 transition-colors"
              autoFocus
            />
            <button
              onClick={checkAnswer}
              disabled={!userAnswer.trim()}
              className="px-6 py-3 bg-purple-700 hover:bg-purple-600 rounded-lg font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              確認
            </button>
          </div>
        </div>
      ) : (
        <div className={`rounded-xl p-6 border ${isCorrect ? 'bg-green-900/20 border-green-800/30' : 'bg-red-900/20 border-red-800/30'}`}>
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-2xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? '正解!' : '不正解'}
            </span>
          </div>

          {!isCorrect && (
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">あなたの回答: <span className="text-red-400">{userAnswer}</span></div>
              <div className="text-sm text-gray-400">正解: <span className="text-green-400 font-semibold">{current.answer}</span></div>
            </div>
          )}

          <button
            onClick={() => setShowAllSteps(!showAllSteps)}
            className="text-sm text-purple-400 hover:text-purple-300 mb-3 transition-colors"
          >
            {showAllSteps ? '非表示' : '表示'} - ステップバイステップ解法
          </button>

          {showAllSteps && (
            <div className="space-y-2 mb-4">
              {current.steps.map((step, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="shrink-0 w-5 h-5 bg-purple-800 rounded-full flex items-center justify-center text-xs font-bold text-purple-200">
                    {i + 1}
                  </span>
                  <p className="text-gray-300 text-sm">{step}</p>
                </div>
              ))}
            </div>
          )}

          <div className="bg-dark-700 rounded-lg p-3 border border-purple-900/20">
            <p className="text-sm text-gray-300">
              <span className="text-purple-400 font-medium">クイック参考:</span> {current.workedExample}
            </p>
          </div>
        </div>
      )}

      {showResult && (
        <div className="flex justify-end">
          <button
            onClick={nextProblem}
            className="px-6 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg font-medium transition-colors"
          >
            次の問題 &rarr;
          </button>
        </div>
      )}
    </div>
  )
}

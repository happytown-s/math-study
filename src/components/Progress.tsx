import questions from '../data/math-exam.json'
import problems from '../data/calc-training.json'
import type { Stats, StatEntry } from '../App'

interface Props {
  stats: Stats
  onReset: () => void
}

interface Question {
  category: string
}
interface Problem {
  category: string
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
  'Mental Math': '暗算',
  'Percentage Calculations': '百分率計算',
  'Speed/Rate Problems': '速さ・割合問題',
  'Probability & Counting': '確率と数え上げ',
  'Geometry Calculations': '幾何計算',
  'Algebraic Manipulation': '代数操作',
  'Financial Math': '金融数学',
  'Unit Conversions': '単位変換',
}

const allCategories = [...new Set([
  ...(questions as Question[]).map(q => q.category),
  ...(problems as Problem[]).map(p => p.category),
])].sort()

export default function Progress({ stats, onReset }: Props) {
  const quizStats = stats.quiz || {}
  const calcStats = stats.calc || {}

  const totalQuiz = Object.values(quizStats).reduce((s: number, v: StatEntry) => s + v.total, 0)
  const totalQuizCorrect = Object.values(quizStats).reduce((s: number, v: StatEntry) => s + v.correct, 0)
  const totalCalc = Object.values(calcStats).reduce((s: number, v: StatEntry) => s + v.total, 0)
  const totalCalcCorrect = Object.values(calcStats).reduce((s: number, v: StatEntry) => s + v.correct, 0)

  const overallAcc = totalQuiz + totalCalc > 0
    ? Math.round(((totalQuizCorrect + totalCalcCorrect) / (totalQuiz + totalCalc)) * 100)
    : null

  const getBar = (correct: number, total: number) => {
    if (total === 0) return { width: 0, color: 'bg-gray-600' }
    const pct = (correct / total) * 100
    const color = pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500'
    return { width: `${pct}%`, color }
  }

  const getStrengthLabel = (pct: number) => {
    if (pct >= 90) return { label: '習得済み', color: 'text-green-400' }
    if (pct >= 75) return { label: '得意', color: 'text-green-300' }
    if (pct >= 60) return { label: '発展中', color: 'text-yellow-400' }
    if (pct >= 40) return { label: '要練習', color: 'text-orange-400' }
    return { label: '苦手', color: 'text-red-400' }
  }

  const quizEntries = (Object.entries(quizStats) as [string, StatEntry][]).sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))
  const calcEntries = (Object.entries(calcStats) as [string, StatEntry][]).sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))

  const strengths: string[] = []
  const weaknesses: string[] = []

  const allEntries = [
    ...quizEntries.map(([k, v]) => ({ key: k, ...v })),
    ...calcEntries.map(([k, v]) => ({ key: k, ...v })),
  ]
  for (const e of allEntries) {
    if (e.total < 3) continue
    const pct = (e.correct / e.total) * 100
    if (pct >= 80) strengths.push(e.key)
    if (pct < 60) weaknesses.push(e.key)
  }

  const catLabel = (cat: string) => categoryNames[cat] || cat

  return (
    <div className="space-y-6">
      <div className="bg-dark-800 rounded-xl p-6 border border-purple-900/30">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-purple-300">全体の進捗</h2>
          <button
            onClick={onReset}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-dark-600"
          >
            全てリセット
          </button>
        </div>

        {overallAcc !== null ? (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-dark-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-purple-400">{overallAcc}%</div>
              <div className="text-sm text-gray-400">全体正答率</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-dark-700 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-white">{totalQuiz + totalCalc}</div>
                <div className="text-xs text-gray-500">解答数</div>
              </div>
              <div className="bg-dark-700 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-green-400">{totalQuizCorrect + totalCalcCorrect}</div>
                <div className="text-xs text-gray-500">正解数</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            まだ練習していません。始めてみましょう!
          </div>
        )}
      </div>

      {allEntries.length > 0 && (strengths.length > 0 || weaknesses.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {strengths.length > 0 && (
            <div className="bg-dark-800 rounded-xl p-5 border border-green-900/30">
              <h3 className="text-sm font-semibold text-green-400 mb-3">得意分野</h3>
              <div className="space-y-2">
                {strengths.map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-300">{catLabel(s)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {weaknesses.length > 0 && (
            <div className="bg-dark-800 rounded-xl p-5 border border-red-900/30">
              <h3 className="text-sm font-semibold text-red-400 mb-3">苦手分野</h3>
              <div className="space-y-2">
                {weaknesses.map(w => (
                  <div key={w} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-sm text-gray-300">{catLabel(w)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {quizEntries.length > 0 && (
        <div className="bg-dark-800 rounded-xl p-6 border border-purple-900/30">
          <h2 className="text-lg font-semibold text-purple-300 mb-4">問題集 - カテゴリ別</h2>
          <div className="space-y-3">
            {quizEntries.map(([cat, v]) => {
              const pct = v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0
              const bar = getBar(v.correct, v.total)
              const strength = getStrengthLabel(pct)
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-300">{catLabel(cat)}</span>
                      <span className={`text-xs ${strength.color}`}>{strength.label}</span>
                    </div>
                    <span className="text-sm text-gray-400">{v.correct}/{v.total} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-dark-600 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-500 ${bar.color}`} style={{ width: bar.width }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {calcEntries.length > 0 && (
        <div className="bg-dark-800 rounded-xl p-6 border border-purple-900/30">
          <h2 className="text-lg font-semibold text-purple-300 mb-4">計算トレーニング - トピック別</h2>
          <div className="space-y-3">
            {calcEntries.map(([cat, v]) => {
              const pct = v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0
              const bar = getBar(v.correct, v.total)
              const strength = getStrengthLabel(pct)
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-300">{catLabel(cat)}</span>
                      <span className={`text-xs ${strength.color}`}>{strength.label}</span>
                    </div>
                    <span className="text-sm text-gray-400">{v.correct}/{v.total} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-dark-600 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-500 ${bar.color}`} style={{ width: bar.width }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="bg-dark-800 rounded-xl p-6 border border-purple-900/30">
        <h2 className="text-lg font-semibold text-purple-300 mb-4">カテゴリカバレッジ</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {allCategories.map(cat => {
            const hasQuiz = quizStats[cat] as StatEntry | undefined
            const hasCalc = calcStats[cat] as StatEntry | undefined
            const activity = hasQuiz || hasCalc
            return (
              <div
                key={cat}
                className={`rounded-lg p-3 border ${
                  activity
                    ? 'bg-dark-700 border-purple-900/30'
                    : 'bg-dark-900 border-dark-600 opacity-50'
                }`}
              >
                <div className="text-sm font-medium text-gray-300 mb-1">{catLabel(cat)}</div>
                <div className="text-xs text-gray-500">
                  {activity
                    ? `${(hasQuiz?.total ?? 0) + (hasCalc?.total ?? 0)} 問解答済み`
                    : '未開始'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import Quiz from './components/Quiz'
import CalcTraining from './components/CalcTraining'
import Progress from './components/Progress'

export type Tab = 'quiz' | 'calc' | 'progress'

export interface StatEntry {
  correct: number
  total: number
}
export interface Stats {
  quiz: Record<string, StatEntry>
  calc: Record<string, StatEntry>
}

export default function App() {
  const [tab, setTab] = useState<Tab>('quiz')
  const [stats, setStats] = useState<Stats>(() => {
    try {
      const raw = localStorage.getItem('math-stats')
      return raw ? JSON.parse(raw) as Stats : { quiz: {}, calc: {} }
    } catch { return { quiz: {}, calc: {} } }
  })

  useEffect(() => {
    localStorage.setItem('math-stats', JSON.stringify(stats))
  }, [stats])

  const updateStats = (type: 'quiz' | 'calc', key: string, correct: boolean) => {
    setStats((prev: Stats) => {
      const section = prev[type] || {}
      const entry = section[key] || { correct: 0, total: 0 }
      const updated = {
        ...entry,
        correct: entry.correct + (correct ? 1 : 0),
        total: entry.total + 1,
      }
      return { ...prev, [type]: { ...section, [key]: updated } }
    })
  }

  const resetStats = () => {
    setStats({ quiz: {}, calc: {} })
    localStorage.removeItem('math-stats')
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'quiz', label: 'Quiz' },
    { id: 'calc', label: 'Calc Training' },
    { id: 'progress', label: 'Progress' },
  ]

  return (
    <div className="min-h-screen bg-dark-900 text-gray-200">
      <header className="bg-dark-800 border-b border-purple-900/50 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-purple-400 tracking-wide">
            <span className="text-purple-600">{'</>'}</span> Math Study
          </h1>
          <nav className="flex gap-1">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  tab === t.id
                    ? 'bg-purple-700 text-white shadow-lg shadow-purple-900/50'
                    : 'text-gray-400 hover:text-white hover:bg-dark-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {tab === 'quiz' && <Quiz stats={stats.quiz} updateStats={(k, c) => updateStats('quiz', k, c)} />}
        {tab === 'calc' && <CalcTraining stats={stats.calc} updateStats={(k, c) => updateStats('calc', k, c)} />}
        {tab === 'progress' && <Progress stats={stats} onReset={resetStats} />}
      </main>
    </div>
  )
}

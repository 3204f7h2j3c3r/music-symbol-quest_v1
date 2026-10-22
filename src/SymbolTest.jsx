
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { CATEGORIES, SYMBOLS } from './legacy/index.js'
import MusicSymbol from './components/MusicSymbol.jsx'
import './index.css'
import './symbol-test.css'

function SymbolTest() {
  const [index, setIndex] = useState(0)
  const symbol = SYMBOLS[index]
  const category = CATEGORIES.find(
    (item) => item.id === symbol.category,
  )

  const previous = () => setIndex((i) => Math.max(0, i - 1))
  const next = () =>
  setIndex((i) => Math.min(SYMBOLS.length - 1, i + 1))

  return (
    <main className="symbol-test">
    <header className="symbol-test-header">
    <h1>音楽記号 表示テスト</h1>
    <p>問題表示と解答欄表示を、1種類ずつ確認できます。</p>
    <a href="/">通常のアプリに戻る</a>
    </header>

    <div className="symbol-test-progress">
    {index + 1} / {SYMBOLS.length} 種類
    <div className="symbol-test-progress-track">
    <div
    className="symbol-test-progress-fill"
    style={{
      width: `${((index + 1) / SYMBOLS.length) * 100}%`,
    }}
    />
    </div>
    </div>

    <section className="symbol-test-current" aria-live="polite">
    <div className="symbol-test-name">
    <span>{category?.label ?? symbol.category}</span>
    <h2>{symbol.reading}</h2>
    <code>{symbol.id}</code>
    </div>

    <div className="symbol-test-comparison">
    <section className="symbol-test-sample">
    <h3>問題表示</h3>
    <div className="symbol-test-problem">
    <MusicSymbol
    symbol={symbol}
    className="inline-flex h-24 w-32 items-center justify-center"
    />
    </div>
    </section>

    <section className="symbol-test-sample">
    <h3>解答欄表示</h3>
    <div className="symbol-test-choices">
    {[1, 2, 3, 4].map((number) => (
      <div className="symbol-test-choice" key={number}>
      <span className="answer-number">{number}</span>
      <MusicSymbol
      symbol={symbol}
      className="inline-flex min-w-12 items-center justify-center text-3xl"
      />
      </div>
    ))}
    </div>
    </section>
    </div>

    <div className="symbol-test-raw">
    <span>元データ</span>
    <code>{JSON.stringify(symbol.display)}</code>
    </div>
    </section>

    <nav className="symbol-test-navigation">
    <button onClick={previous} disabled={index === 0}>
    ← 前の記号
    </button>
    <button
    onClick={() => setIndex(0)}
    disabled={index === 0}
    >
    最初に戻る
    </button>
    <button
    onClick={next}
    disabled={index === SYMBOLS.length - 1}
    >
    次の記号 →
    </button>
    </nav>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<SymbolTest />)

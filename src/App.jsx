import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  AudioLines,
  Check,
  Heart,
  Layers3,
  Music2,
  Repeat,
  RotateCcw,
  Sparkles,
  Timer,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { createUISFX } from 'uisfx'
import { CATEGORIES, SYMBOLS, createGame } from './legacy/index.js'
import MusicSymbol, { BRAVURA_CODES } from './components/MusicSymbol.jsx'

const QUESTION_COUNT = 10

const CATEGORY_ICONS = {
  notes: Music2,
  tempo: Timer,
  performance: AudioLines,
  dynamics: Volume2,
  notation: Repeat,
}

const uiSfx = createUISFX({
  pack: 'minimal',
  preferences: {
    key: 'music-symbol-quest:sound',
  },
})

function App() {
  const [category, setCategory] = useState(null)
  const [session, setSession] = useState(null)
  const [snapshot, setSnapshot] = useState(null)
  const [question, setQuestion] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [result, setResult] = useState(null)
  const [soundEnabled, setSoundEnabled] = useState(() => uiSfx.isEnabled())

  function startGame(selectedCategory) {
    const symbols = selectedCategory
      ? SYMBOLS.filter((symbol) => symbol.category === selectedCategory)
      : SYMBOLS

    const nextSession = createGame({
      symbols,
      rounds: Math.min(QUESTION_COUNT, symbols.length),
      lives: 3,
    })

    setCategory(selectedCategory)
    setSession(nextSession)
    setSnapshot(nextSession.state)
    setQuestion(nextSession.current())
    setFeedback(null)
    setResult(null)
  }

  async function answer(index) {
    if (!session || feedback) return

    try {
      await uiSfx.unlock()
    } catch {
      // 音声が使えなくてもゲームは続行する
    }

    const answerResult = session.answer(index)

    setFeedback({
      ...answerResult,
      selectedIndex: index,
    })
    setSnapshot(session.state)

    try {
      uiSfx.play(answerResult.isCorrect ? 'forward' : 'delete')
    } catch {
      // 効果音の失敗でゲームを止めない
    }
  }

  function nextQuestion() {
    if (!session || !feedback) return

    session.next()

    if (session.state.finished) {
      setResult(session.result())
      setQuestion(null)

      try {
        uiSfx.play('level-up')
      } catch {
        // 効果音の失敗で結果表示を妨げない
      }
    } else {
      setQuestion(session.current())
    }

    setSnapshot(session.state)
    setFeedback(null)
  }

  function returnToMenu() {
    setCategory(null)
    setSession(null)
    setSnapshot(null)
    setQuestion(null)
    setFeedback(null)
    setResult(null)
  }

  const selectedCategory = CATEGORIES.find(
    (item) => item.id === category,
  )

  const progress = snapshot
    ? ((snapshot.index + (feedback ? 1 : 0)) / snapshot.total) * 100
    : 0

  return (
    <main className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <div className="brand-mark" aria-hidden="true">
            <img src="/headphones.svg" alt="" width="21" height="21" />
          </div>
          <div>
            <h1 className="brand-title">音楽記号クエスト</h1>
            <p className="brand-subtitle">音楽記号を、ひとつずつ。</p>


          </div>
          <button
          type="button"
          className="header-sound-button"
          aria-label={soundEnabled ? "効果音をオフにする" : "効果音をオンにする"}
          aria-pressed={soundEnabled}
          title={soundEnabled ? "効果音：オン" : "効果音：オフ"}
          onClick={() => {
            const next = !soundEnabled
            uiSfx.setEnabled(next)
            setSoundEnabled(next)
          }}
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>
      </header>

      <div className="page-container">
        {!session && (
          <section aria-labelledby="menu-title">
            <div className="menu-intro">
              <p className="eyebrow">Music Symbol Quest</p>
              <h2 id="menu-title" className="page-title">
                分野を選択
              </h2>
              <p className="page-description">
                すべての分野をまとめて練習することもできます。
              </p>
            </div>

            <div className="category-grid">
              {CATEGORIES.map((item) => {
                const count = SYMBOLS.filter(
                  (symbol) => symbol.category === item.id,
                ).length
                const Icon = CATEGORY_ICONS[item.id] ?? Music2

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => startGame(item.id)}
                    className="category-card"
                  >
                    <span className="category-icon" aria-hidden="true">
                      <Icon size={21} strokeWidth={1.8} />
                    </span>
                    <span className="category-name">{item.label}</span>
                    <span className="category-count">
                      {count}種類の記号
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="all-categories">
              <button
                type="button"
                className="all-categories-button"
                onClick={() => startGame(null)}
              >
                <Layers3 size={17} />
                すべての分野に挑戦
                <ArrowRight size={16} />
              </button>
            </div>
          </section>
        )}

        {session && question && snapshot && (
          <section className="game-container" aria-label="クイズ">
            <div className="game-topbar">
              <button
                type="button"
                className="back-button"
                onClick={returnToMenu}
              >
                <ArrowLeft size={17} />
                メニュー
              </button>
              <span className="category-label">
                {selectedCategory?.label ?? '全カテゴリ'}
              </span>
            </div>

            <div className="stats-grid" aria-label="ゲーム状況">
              <div className="stat-card">
                <p className="stat-label">問題</p>
                <p className="stat-value">
                  {Math.min(snapshot.index + 1, snapshot.total)}
                  <span style={{ color: 'var(--text-muted)' }}>
                    /{snapshot.total}
                  </span>
                </p>
              </div>
              <div className="stat-card">
                <p className="stat-label">スコア</p>
                <p className="stat-value">{snapshot.score}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">コンボ</p>
                <p className="stat-value">{snapshot.combo}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">ライフ</p>
                <p className="stat-value lives" aria-label={`残りライフ ${snapshot.lives}`}>
                  {snapshot.lives > 0 ? (
                    Array.from({ length: snapshot.lives }, (_, index) => (
                      <Heart
                        key={index}
                        size={16}
                        strokeWidth={2}
                        fill="currentColor"
                        aria-hidden="true"
                      />
                    ))
                  ) : (
                    '0'
                  )}
                </p>
              </div>
            </div>

            <div
              className="progress-track"
              role="progressbar"
              aria-label="問題の進行状況"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
            >
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="question-card">
              <p className="question-label">
                {question.type === 'meaning'
                  ? 'この記号の意味は？'
                  : question.type === 'reading'
                    ? 'この記号の読み方は？'
                    : 'この意味・読み方に当てはまる記号は？'}
              </p>

              <div className="question-display">
                {question.type === 'symbol' ? (
                  <div>
                    <p className="question-prompt-main">
                      {question.prompt.main}
                    </p>
                    <p className="question-prompt-sub">
                      {question.prompt.sub}
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: 'clamp(3.5rem, 12vw, 5rem)',
                      lineHeight: 1.2,
                    }}
                  >
                    <MusicSymbol
                      symbol={question.symbol}
                      className="inline-flex h-24 w-32 items-center justify-center"
                    />
                  </div>
                )}
              </div>

              <div className="answer-grid">
                {question.choices.map((choice, index) => {
                  const symbolChoice =
                    question.type === 'symbol'
                      ? SYMBOLS.find(
                          (symbol) =>
                            symbol.display === choice &&
                            BRAVURA_CODES[symbol.id] !== undefined,
                        )
                      : null

                  const isCorrect = feedback?.correctIndex === index
                  const isWrong =
                    Boolean(feedback) &&
                    !feedback.isCorrect &&
                    feedback.selectedIndex === index

                  let stateClass = ''
                  if (feedback && isCorrect) stateClass = ' is-correct'
                  else if (isWrong) stateClass = ' is-wrong'

                  return (
                    <button
                      key={`${choice}-${index}`}
                      type="button"
                      disabled={Boolean(feedback)}
                      onClick={() => answer(index)}
                      className={`answer-option${stateClass}`}
                    >
                      <span className="answer-number">{index + 1}</span>
                      <span>
                        {symbolChoice ? (
                          <MusicSymbol
                            symbol={symbolChoice}
                            className="inline-flex min-w-12 items-center justify-center text-3xl"
                          />
                        ) : (
                          choice
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>

              {feedback && (
                <div className="feedback-panel" aria-live="polite">
                  <p
                    className={`feedback-heading ${
                      feedback.isCorrect ? 'is-correct' : 'is-wrong'
                    }`}
                  >
                    {feedback.isCorrect ? (
                      <Check size={19} />
                    ) : (
                      <X size={19} />
                    )}
                    {feedback.isCorrect
                      ? `正解！ +${feedback.gained} 点`
                      : '不正解'}
                  </p>

                  {!feedback.isCorrect && (
                    <p className="feedback-detail">
                      正解：{question.choices[feedback.correctIndex]}
                    </p>
                  )}

                  <button
                    type="button"
                    className="next-button"
                    onClick={nextQuestion}
                  >
                    {snapshot.index + 1 >= snapshot.total ||
                    snapshot.lives <= 0
                      ? '結果を見る'
                      : '次の問題へ'}
                    <ArrowRight size={17} />
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {session && !question && result && (
          <section className="result-card" aria-labelledby="result-title">
            <div className="result-icon" aria-hidden="true">
              <Sparkles size={25} strokeWidth={1.7} />
            </div>

            <p className="eyebrow">Challenge complete</p>
            <h2 id="result-title" className="result-title">
              チャレンジ終了！
            </h2>

            <p className="result-rank">{result.rank}</p>
            <p className="result-caption">
              {result.correct} / {result.total} 問正解
            </p>
            <p className="result-score">{result.score} 点</p>

            <div className="result-summary">
              <span>最大コンボ</span>
              <strong>{result.maxCombo}</strong>
            </div>

            <div className="result-actions">
              <button
                type="button"
                className="result-primary"
                onClick={() => startGame(category)}
              >
                <RotateCcw size={17} />
                もう一度挑戦
              </button>
              <button
                type="button"
                className="result-secondary"
                onClick={returnToMenu}
              >
                メニューへ戻る
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

export default App

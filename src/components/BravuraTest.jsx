
const samples = [
  // 音符
  { label: '全音符', code: 0xE1D2 },
{ label: '2分音符', code: 0xE1D3 },
{ label: '4分音符', code: 0xE1D5 },
{ label: '8分音符', code: 0xE1D7 },
{ label: '16分音符', code: 0xE1D9 },

// 休符
{ label: '全休符', code: 0xE4E3 },
{ label: '2分休符', code: 0xE4E4 },
{ label: '4分休符', code: 0xE4E5 },
{ label: '8分休符', code: 0xE4E6 },
{ label: '16分休符', code: 0xE4E7 },

// 奏法・アーティキュレーション
{ label: 'スタッカート', code: 0xE4A2 },
{ label: 'テヌート', code: 0xE4A4 },
{ label: 'アクセント', code: 0xE4A0 },
{ label: 'マルカート', code: 0xE4AC },
{ label: 'フェルマータ', code: 0xE4C0 },

// 変化記号
{ label: 'シャープ', code: 0xE262 },
{ label: 'フラット', code: 0xE260 },
{ label: 'ナチュラル', code: 0xE261 },
]

export default function BravuraTest() {
  return (
    <section className="mx-auto max-w-5xl space-y-6 p-6">
    <div>
    <h2 className="text-2xl font-bold">
    Bravura Text — 音楽記号テスト
    </h2>
    <p className="mt-2 text-sm text-muted">
    フォントの表示確認用です。ゲーム本体にはまだ反映されません。
    </p>
    </div>

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
    {samples.map((sample) => (
      <article
      key={sample.label}
      className="rounded-xl border border-default-200 p-4 text-center"
      >
      <h3 className="text-sm font-medium">{sample.label}</h3>

      <div
      className="my-4 flex h-20 items-center justify-center"
      style={{
        fontFamily: '"Bravura Text", serif',
        fontSize: '56px',
      }}
      >
      {String.fromCodePoint(sample.code)}
      </div>

      <p className="text-xs text-muted">
      U+{sample.code.toString(16).toUpperCase()}
      </p>
      </article>
    ))}
    </div>
    </section>
  )
}

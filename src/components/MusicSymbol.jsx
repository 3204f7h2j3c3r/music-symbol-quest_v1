import { svgFor } from '../legacy/index.js'

export const BRAVURA_CODES = {
  'whole-note': 0xE1D2,
  'half-note': 0xE1D3,
  'quarter-note': 0xE1D5,
  'eighth-note': 0xE1D7,
  'sixteenth-note': 0xE1D9,
  'whole-rest': 0xE4E3,
  'half-rest': 0xE4E4,
  'quarter-rest': 0xE4E5,
  'eighth-rest': 0xE4E6,
  'sixteenth-rest': 0xE4E7,
}

function RestOnStaff({ type, className }) {
  const isWhole = type === 'whole-rest'
  const lines = [12, 18, 24, 30, 36]
  const restY = isWhole ? 18 : 21

  return (
    <span
    className={`music-symbol music-symbol--rest music-symbol--${type} ${className}`}
    role="img"
    aria-label={isWhole ? '全休符（五線付き）' : '二分休符（五線付き）'}
    >
    <svg
    viewBox="0 0 44 48"
    width="100%"
    height="100%"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    >
    {lines.map((y) => (
      <rect
      key={y}
      x="1"
      y={y - 0.6}
      width="42"
      height="1.2"
      fill="currentColor"
      opacity="0.75"
      />
    ))}
    <rect
    x="15"
    y={restY}
    width="14"
    height="3"
    fill="currentColor"
    />
    </svg>
    </span>
  )
}

export default function MusicSymbol({ symbol, className = '' }) {
  if (symbol.id === 'whole-rest' || symbol.id === 'half-rest') {
    return <RestOnStaff type={symbol.id} className={className} />
  }

  const code = BRAVURA_CODES[symbol.id]

  if (code !== undefined) {
    return (
      <span
      className={`music-symbol music-symbol--font music-symbol--${symbol.id} ${className}`}
      style={{ fontFamily: '"Bravura Text", serif' }}
      >
      {String.fromCodePoint(code)}
      </span>
    )
  }

  const svg = svgFor(symbol.id)

  if (svg) {
    return (
      <span
      className={`music-symbol music-symbol--svg ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
      />
    )
  }

  return <span className={`music-symbol ${className}`}>{symbol.display}</span>
}

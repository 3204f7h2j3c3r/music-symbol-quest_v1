import './game.js'
import './symbols.js'
import './glyphs.js'

const game = window.MusicGame
const data = window.MusicData
const glyphs = window.MusicGlyphs

export const QUESTION_TYPES = game.QUESTION_TYPES
export const createGame = game.createGame
export const calcRank = game.calcRank

export const CATEGORIES = data.CATEGORIES
export const SYMBOLS = data.SYMBOLS

export const svgFor = glyphs.svgFor

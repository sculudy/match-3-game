export const DIFFICULTY_CONFIG = {
  easy: {
    name: '简单',
    gridSize: 3,
    maxBalloons: 3,
    balloonColors: ['🎈', '🎈', '🎈'],
    colorOptions: ['#FF6B6B', '#FF8E72', '#FFA96D'],
    scoreMultiplier: 1
  },
  normal: {
    name: '普通',
    gridSize: 3,
    maxBalloons: 5,
    balloonColors: ['🎈', '🎈', '🎈', '🎈', '🎈'],
    colorOptions: ['#FF6B6B', '#FF8E72', '#FFA96D', '#FFD93D', '#6BCB77'],
    scoreMultiplier: 1
  },
  hard: {
    name: '困难',
    gridSize: 4,
    maxBalloons: 8,
    balloonColors: ['🎈', '🎈', '🎈', '🎈', '🎈', '🎈', '🎈', '🎈'],
    colorOptions: ['#FF6B6B', '#FF8E72', '#FFA96D', '#FFD93D', '#6BCB77', '#4D96FF', '#9B59B6'],
    scoreMultiplier: 1.5
  }
}

export const SCORE_CONFIG = {
  baseScore: 100,
  tier1Threshold: 3,
  tier1Score: 150,
  tier2Threshold: 10,
  tier2Score: 200
}

export const GAME_CONFIG = {
  gameDuration: 60,
  balloonAnimationDuration: 0.3,
  explosionAnimationDuration: 0.5
}
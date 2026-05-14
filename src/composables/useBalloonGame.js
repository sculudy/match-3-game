import { ref, computed } from 'vue'
import { DIFFICULTY_CONFIG, SCORE_CONFIG, GAME_CONFIG } from '../constants/balloonConfig'

export function useBalloonGame() {
  const difficulty = ref('normal')
  const score = ref(0)
  const combo = ref(0)
  const maxCombo = ref(0)
  const timeLeft = ref(GAME_CONFIG.gameDuration)
  const isPlaying = ref(false)
  const isPaused = ref(false)
  const balloons = ref([])
  const explosions = ref([])
  const particles = ref([])
  
  let timer = null
  
  const config = computed(() => DIFFICULTY_CONFIG[difficulty.value])
  
  const currentScorePerBalloon = computed(() => {
    if (combo.value >= SCORE_CONFIG.tier2Threshold) {
      return SCORE_CONFIG.tier2Score
    } else if (combo.value >= SCORE_CONFIG.tier1Threshold) {
      return SCORE_CONFIG.tier1Score
    }
    return SCORE_CONFIG.baseScore
  })
  
  const comboLevel = computed(() => {
    if (combo.value >= SCORE_CONFIG.tier2Threshold) return 3
    if (combo.value >= SCORE_CONFIG.tier1Threshold) return 2
    return 1
  })
  
  const getEmptyCells = () => {
    const gridSize = config.value.gridSize
    const occupiedCells = balloons.value.map(b => `${b.row}-${b.col}`)
    const emptyCells = []
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (!occupiedCells.includes(`${row}-${col}`)) {
          emptyCells.push({ row, col })
        }
      }
    }
    
    return emptyCells
  }
  
  const getRandomColor = () => {
    const colors = config.value.colorOptions
    return colors[Math.floor(Math.random() * colors.length)]
  }
  
  const createBalloon = () => {
    const emptyCells = getEmptyCells()
    if (emptyCells.length === 0 || balloons.value.length >= config.value.maxBalloons) {
      return null
    }
    
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    const id = Date.now() + Math.random()
    
    return {
      id,
      row: randomCell.row,
      col: randomCell.col,
      color: getRandomColor(),
      emoji: '🎈',
      isNew: true
    }
  }
  
  const initBalloons = () => {
    balloons.value = []
    for (let i = 0; i < config.value.maxBalloons; i++) {
      const balloon = createBalloon()
      if (balloon) {
        balloons.value.push(balloon)
      }
    }
  }
  
  const addBalloon = () => {
    const balloon = createBalloon()
    if (balloon) {
      balloons.value.push(balloon)
      setTimeout(() => {
        const b = balloons.value.find(bl => bl.id === balloon.id)
        if (b) b.isNew = false
      }, GAME_CONFIG.balloonAnimationDuration * 1000)
    }
  }
  
  const createParticles = (row, col, particleType) => {
    const colors = {
      pink: ['#FF6B9D', '#FF8FAB', '#FFB6C1', '#FFC0CB'],
      gold: ['#FFD700', '#FFEC8B', '#FFFACD', '#FFE4B5']
    }
    
    const particleColorSet = colors[particleType] || colors.pink
    const newParticles = []
    
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12
      const speed = 2 + Math.random() * 3
      const size = 6 + Math.random() * 8
      
      newParticles.push({
        id: Date.now() + Math.random() + i,
        row,
        col,
        offsetX: Math.cos(angle) * speed,
        offsetY: Math.sin(angle) * speed - 2,
        size,
        color: particleColorSet[Math.floor(Math.random() * particleColorSet.length)],
        type: particleType
      })
    }
    
    particles.value.push(...newParticles)
    
    setTimeout(() => {
      particles.value = particles.value.filter(p => 
        !(p.row === row && p.col === col && p.type === particleType)
      )
    }, 1000)
  }
  
  const popBalloon = (balloonId) => {
    const balloonIndex = balloons.value.findIndex(b => b.id === balloonId)
    if (balloonIndex === -1) return
    
    const balloon = balloons.value[balloonIndex]
    
    explosions.value.push({
      id: balloon.id,
      row: balloon.row,
      col: balloon.col,
      color: balloon.color
    })
    
    balloons.value.splice(balloonIndex, 1)
    
    combo.value++
    if (combo.value > maxCombo.value) {
      maxCombo.value = combo.value
    }
    
    const earnedScore = Math.floor(currentScorePerBalloon.value * config.value.scoreMultiplier)
    score.value += earnedScore
    
    if (combo.value >= SCORE_CONFIG.tier2Threshold) {
      createParticles(balloon.row, balloon.col, 'gold')
    } else if (combo.value >= SCORE_CONFIG.tier1Threshold) {
      createParticles(balloon.row, balloon.col, 'pink')
    }
    
    setTimeout(() => {
      explosions.value = explosions.value.filter(e => e.id !== balloon.id)
    }, GAME_CONFIG.explosionAnimationDuration * 1000)
    
    setTimeout(() => {
      addBalloon()
    }, 200)
  }
  
  const miss = () => {
    combo.value = 0
  }
  
  const startGame = (selectedDifficulty = 'normal') => {
    difficulty.value = selectedDifficulty
    score.value = 0
    combo.value = 0
    maxCombo.value = 0
    timeLeft.value = GAME_CONFIG.gameDuration
    isPlaying.value = true
    isPaused.value = false
    balloons.value = []
    explosions.value = []
    particles.value = []
    
    initBalloons()
    
    timer = setInterval(() => {
      if (!isPaused.value && isPlaying.value) {
        timeLeft.value--
        if (timeLeft.value <= 0) {
          endGame()
        }
      }
    }, 1000)
  }
  
  const pauseGame = () => {
    isPaused.value = true
  }
  
  const resumeGame = () => {
    isPaused.value = false
  }
  
  const endGame = () => {
    isPlaying.value = false
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }
  
  const resetGame = () => {
    endGame()
    score.value = 0
    combo.value = 0
    maxCombo.value = 0
    timeLeft.value = GAME_CONFIG.gameDuration
    balloons.value = []
    explosions.value = []
    particles.value = []
  }
  
  return {
    difficulty,
    score,
    combo,
    maxCombo,
    timeLeft,
    isPlaying,
    isPaused,
    balloons,
    explosions,
    particles,
    config,
    currentScorePerBalloon,
    comboLevel,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    resetGame,
    popBalloon,
    miss
  }
}
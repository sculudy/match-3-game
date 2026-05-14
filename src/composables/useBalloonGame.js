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
  const fullscreenParticles = ref([])
  const fastestReaction = ref(Infinity)
  const lastReaction = ref(null)
  const gameRecords = ref([])
  
  let timer = null
  
  const config = computed(() => DIFFICULTY_CONFIG[difficulty.value])
  
  const currentScorePerBalloon = computed(() => {
    if (combo.value >= SCORE_CONFIG.tier4Threshold) {
      return SCORE_CONFIG.tier4Score
    } else if (combo.value >= SCORE_CONFIG.tier3Threshold) {
      return SCORE_CONFIG.tier3Score
    } else if (combo.value >= SCORE_CONFIG.tier2Threshold) {
      return SCORE_CONFIG.tier2Score
    } else if (combo.value >= SCORE_CONFIG.tier1Threshold) {
      return SCORE_CONFIG.tier1Score
    }
    return SCORE_CONFIG.baseScore
  })
  
  const comboLevel = computed(() => {
    if (combo.value >= SCORE_CONFIG.tier4Threshold) return 5
    if (combo.value >= SCORE_CONFIG.tier3Threshold) return 4
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
      isNew: true,
      createdAt: Date.now()
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
  
  const createFullscreenParticles = (particleType) => {
    const colors = {
      pink: ['#FF6B9D', '#FF8FAB', '#FFB6C1', '#FFC0CB', '#FF1493', '#FF69B4'],
      gold: ['#FFD700', '#FFEC8B', '#FFFACD', '#FFE4B5', '#FFA500', '#FFC125'],
      purple: ['#9B59B6', '#8E44AD', '#B980F0', '#D4A5FF', '#A855F7', '#C084FC']
    }
    
    const particleColorSet = colors[particleType] || colors.pink
    const newParticles = []
    
    // 从四周产生粒子
    const edges = ['top', 'bottom', 'left', 'right']
    
    for (let i = 0; i < 50; i++) {
      const edge = edges[i % edges.length]
      let startX, startY, offsetX, offsetY
      
      if (edge === 'top') {
        startX = 5 + Math.random() * 90
        startY = 5 + Math.random() * 10
        offsetX = (Math.random() - 0.5) * 100
        offsetY = 20 + Math.random() * 60
      } else if (edge === 'bottom') {
        startX = 5 + Math.random() * 90
        startY = 85 + Math.random() * 10
        offsetX = (Math.random() - 0.5) * 100
        offsetY = -20 - Math.random() * 60
      } else if (edge === 'left') {
        startX = 5 + Math.random() * 10
        startY = 5 + Math.random() * 90
        offsetX = 20 + Math.random() * 60
        offsetY = (Math.random() - 0.5) * 100
      } else {
        startX = 85 + Math.random() * 10
        startY = 5 + Math.random() * 90
        offsetX = -20 - Math.random() * 60
        offsetY = (Math.random() - 0.5) * 100
      }
      
      const size = 12 + Math.random() * 24
      
      newParticles.push({
        id: Date.now() + Math.random() + i,
        startX,
        startY,
        offsetX,
        offsetY,
        size,
        color: particleColorSet[Math.floor(Math.random() * particleColorSet.length)],
        type: particleType,
        delay: Math.random() * 0.4
      })
    }
    
    fullscreenParticles.value.push(...newParticles)
    
    setTimeout(() => {
      fullscreenParticles.value = fullscreenParticles.value.filter(p => 
        !newParticles.find(np => np.id === p.id)
      )
    }, 1500)
  }
  
  const popBalloon = (balloonId) => {
    const balloonIndex = balloons.value.findIndex(b => b.id === balloonId)
    if (balloonIndex === -1) return
    
    const balloon = balloons.value[balloonIndex]
    
    // 计算反应时间
    const reactionTime = Date.now() - balloon.createdAt
    lastReaction.value = reactionTime
    if (reactionTime < fastestReaction.value) {
      fastestReaction.value = reactionTime
    }
    
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
    
    if (combo.value >= SCORE_CONFIG.tier4Threshold) {
      createParticles(balloon.row, balloon.col, 'gold')
      createFullscreenParticles('gold')
    } else if (combo.value >= SCORE_CONFIG.tier3Threshold) {
      createParticles(balloon.row, balloon.col, 'pink')
      createFullscreenParticles('purple')
    } else if (combo.value >= SCORE_CONFIG.tier2Threshold) {
      createParticles(balloon.row, balloon.col, 'pink')
      createFullscreenParticles('pink')
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
  
  // 加载游戏记录
  const loadGameRecords = () => {
    try {
      const saved = localStorage.getItem('balloonGameRecords')
      if (saved) {
        gameRecords.value = JSON.parse(saved)
      }
    } catch (e) {
      console.error('Failed to load game records:', e)
    }
  }
  
  // 保存游戏记录
  const saveGameRecord = (record) => {
    try {
      const existingRecords = gameRecords.value.filter(r => !(r.difficulty === difficulty.value && r.score === record.score))
      const newRecords = [...existingRecords, record].sort((a, b) => b.score - a.score).slice(0, 10)
      gameRecords.value = newRecords
      localStorage.setItem('balloonGameRecords', JSON.stringify(newRecords))
    } catch (e) {
      console.error('Failed to save game record:', e)
    }
  }
  
  // 获取某个难度的记录
  const getRecordsByDifficulty = (diff) => {
    return gameRecords.value.filter(r => r.difficulty === diff).sort((a, b) => b.score - a.score)
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
    fastestReaction.value = Infinity
    lastReaction.value = null
    
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
    
    // 保存游戏记录
    if (score.value > 0) {
      const record = {
        difficulty: difficulty.value,
        score: score.value,
        maxCombo: maxCombo.value,
        fastestReaction: fastestReaction.value === Infinity ? 0 : fastestReaction.value,
        date: new Date().toLocaleString()
      }
      saveGameRecord(record)
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
    fullscreenParticles,
    fastestReaction,
    lastReaction,
    gameRecords,
    config,
    currentScorePerBalloon,
    comboLevel,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    resetGame,
    popBalloon,
    miss,
    loadGameRecords,
    getRecordsByDifficulty
  }
}
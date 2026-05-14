<template>
  <div class="app-container">
    <!-- 主页面 -->
    <MainPage v-if="currentView === 'main'" @start-game="goToLevelSelect" @start-balloon-game="goToBalloonGame" />
    
    <!-- 打气球游戏页面 -->
    <BalloonGame v-else-if="currentView === 'balloon'" @back="goToMain" />

    <!-- 关卡选择页面 -->
    <LevelSelect 
      v-else-if="currentView === 'levels'" 
      @back="goToMain"
      @start-level="startLevelGame"
    />

    <!-- 游戏页面 -->
    <div v-else-if="currentView === 'game'" class="game-container">
      <!-- 飘落叶子背景 -->
      <div class="game-leaves-container">
        <div class="game-leaf" v-for="n in 12" :key="n" :style="getLeafStyle(n)"></div>
      </div>
      
      <!-- 天空背景 -->
      <div class="game-sky">
        <!-- 太阳 -->
        <div class="game-sun"></div>
        
        <!-- 云朵 -->
        <div class="game-cloud game-cloud-1"></div>
        <div class="game-cloud game-cloud-2"></div>
        
        <!-- 远山 -->
        <div class="game-mountains">
          <div class="game-mountain game-m-1"></div>
          <div class="game-mountain game-m-2"></div>
          <div class="game-mountain game-m-3"></div>
        </div>
      </div>
      
      <!-- 草地背景 -->
      <div class="game-grass">
        <!-- 草叶装饰 -->
        <div class="game-grass-blades">
          <div 
            v-for="i in 15" 
            :key="i" 
            class="game-blade"
            :style="{
              left: (i * 6.5) + '%',
              height: (15 + Math.random() * 15) + 'px',
              animationDelay: (Math.random() * 2.5) + 's'
            }"
          ></div>
        </div>
      </div>
      
      <!-- 游戏内容 -->
      <div class="game-content-wrapper">
        <GameHeader 
          :score="score" 
          :level="currentLevel"
          :moves="movesLeft"
          @reset="resetCurrentLevel" 
          @exit="exitToLevels"
        />
        
        <div class="game-content">
          <!-- 木制游戏框 -->
          <div class="wooden-frame">
            <div class="frame-top"></div>
            <div class="frame-bottom"></div>
            <div class="frame-left"></div>
            <div class="frame-right"></div>
            <div class="frame-corner corner-tl"></div>
            <div class="frame-corner corner-tr"></div>
            <div class="frame-corner corner-bl"></div>
            <div class="frame-corner corner-br"></div>
            
            <div class="game-board-wrapper">
              <GameBoard 
                :grid="grid"
                :obstacle-grid="obstacleGrid"
                :selected-cell="selectedCell"
                :matched-cells="matchedCells"
                :hint-cells="hintCells"
                :show-hint="showHint"
                @cell-click="handleCellClick"
                @cell-swipe="handleCellSwipe"
                @cell-interaction="handleGameInteraction"
              />
            </div>
          </div>
          
          <div class="game-sidebar">
            <div class="info-card wooden-card">
              <div class="card-top"></div>
              <div class="card-bottom"></div>
              <div class="card-content">
                <h3>🎯 本关任务</h3>
                <div class="task-progress">
                <div 
                  v-for="(task, idx) in currentLevelConfig?.tasks" 
                  :key="idx"
                  class="task-item"
                >
                  <span class="task-emoji">
                    {{ task.type === 'fruits' ? getFruitEmoji(task.fruitId) : 
                       task.type === 'obstacles' ? getObstacleEmoji(task.obstacleType) : '⭐' }}
                  </span>
                  <div class="task-bar-container">
                    <div 
                      class="task-bar"
                      :style="{ width: getTaskProgress(task) + '%' }"
                    ></div>
                  </div>
                  <span class="task-text">{{ getTaskCurrent(task) }}/{{ getTaskTarget(task) }}</span>
                </div>
              </div>
              <div class="moves-info">
                <span class="moves-icon">♟️</span>
                <span class="moves-text">剩余步数: {{ moves }}</span>
              </div>
              </div>
            </div>
            <div class="gems-preview wooden-card">
              <div class="card-top"></div>
              <div class="card-bottom"></div>
              <div class="card-content">
                <h3>水果图鉴</h3>
                <div class="gems-list">
                  <div 
                    v-for="gem in GEM_TYPES" 
                    :key="gem.id"
                    class="gem-preview-item"
                  >
                    <span class="gem-emoji">{{ gem.emoji }}</span>
                    <span class="gem-name">{{ gem.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 关卡介绍弹窗 -->
      <div v-if="showLevelIntro" class="level-intro-overlay" @click="closeLevelIntro">
        <div class="level-intro-modal" @click.stop>
          <div class="modal-header">
            <span class="modal-icon">🍎</span>
            <h2>第 {{ currentLevel }} 关</h2>
            <span class="level-name">{{ currentLevelConfig?.name }}</span>
          </div>
          <p class="modal-desc">{{ currentLevelConfig?.description }}</p>
          <div class="intro-tasks">
            <h4>🎯 本关任务</h4>
            <div class="intro-task-list">
                <div 
                  v-for="(task, idx) in currentLevelConfig?.tasks" 
                  :key="idx"
                  class="intro-task-item"
                >
                  <span class="task-emoji">
                    {{ task.type === 'fruits' ? getFruitEmoji(task.fruitId) : 
                       task.type === 'obstacles' ? getObstacleEmoji(task.obstacleType) : '⭐' }}
                  </span>
                  <span class="task-text">
                    {{ task.type === 'fruits' ? `收集 ${task.count} 个 ${getFruitName(task.fruitId)}` : 
                       task.type === 'obstacles' ? `消除 ${task.count} 个 ${getObstacleName(task.obstacleType)}` :
                       `达到 ${task.score} 分` }}
                  </span>
                </div>
              </div>
          </div>
          <div class="intro-stats">
            <div class="stat-item">
              <span class="stat-icon">♟️</span>
              <span class="stat-text">步数限制: {{ currentLevelConfig?.moves }}</span>
            </div>
          </div>
          <p class="tap-hint">👆 点击任意位置开始游戏</p>
        </div>
      </div>
      
      <!-- 关卡完成弹窗 -->
      <div v-if="showLevelComplete" class="level-complete-overlay">
        <div class="level-complete-modal">
          <div class="modal-header">
            <span class="modal-icon">🎉</span>
            <h2>关卡完成！</h2>
          </div>
          <p class="modal-message">恭喜你完成了「{{ currentLevelConfig?.name }}」！</p>
          <div class="modal-score">
            <span>得分: {{ score }}</span>
          </div>
          <div class="modal-buttons">
            <button class="modal-btn retry-btn" @click="resetCurrentLevel">🔄 再玩一次</button>
            <button class="modal-btn next-btn" @click="nextLevel">➡️ 下一关</button>
            <button class="modal-btn exit-btn" @click="exitToLevels">🏠 返回关卡</button>
          </div>
        </div>
      </div>
      
      <!-- 游戏失败弹窗 -->
      <div v-if="showGameOver" class="level-complete-overlay">
        <div class="level-complete-modal game-over">
          <div class="modal-header">
            <span class="modal-icon">😢</span>
            <h2>步数用完了</h2>
          </div>
          <p class="modal-message">还差一点！再试一次吧！</p>
          <div class="modal-score">
            <span>当前得分: {{ score }}</span>
          </div>
          <div class="modal-buttons">
            <button class="modal-btn retry-btn" @click="resetCurrentLevel">🔄 再试一次</button>
            <button class="modal-btn exit-btn" @click="exitToLevels">🏠 返回关卡</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import MainPage from './components/MainPage.vue'
import LevelSelect from './components/LevelSelect.vue'
import GameHeader from './components/GameHeader.vue'
import GameBoard from './components/GameBoard.vue'
import BalloonGame from './components/BalloonGame.vue'
import { useGameLogic } from './composables/useGameLogic.js'
import { useSoundEffects } from './composables/useSoundEffects.js'
import { GEM_TYPES } from './constants/gameConfig.js'
import { LEVELS, unlockLevel } from './constants/levels.js'

const currentView = ref('main')
const currentLevel = ref(1)
const currentLevelConfig = ref(null)
const movesLeft = ref(20)
const taskProgress = reactive({})
const showLevelComplete = ref(false)
const showGameOver = ref(false)
const showLevelIntro = ref(false)

// 智能提示相关状态
const hintCells = ref(null)
const showHint = ref(false)
let idleTimer = null
const IDLE_TIMEOUT = 15000

const {
  grid,
  obstacleGrid,
  score,
  moves,
  selectedCell,
  matchedCells,
  currentLevel: gameLogicLevel,
  taskProgress: gameLogicTaskProgress,
  initLevel,
  handleCellClick,
  handleCellSwipe,
  addMatchListener,
  addMoveListener,
  checkWin,
  checkLose
} = useGameLogic()

const { playGameStartSound, playGameOverSound, startBackgroundMusic } = useSoundEffects()

const goToLevelSelect = () => {
  currentView.value = 'levels'
}

const goToBalloonGame = () => {
  currentView.value = 'balloon'
}

const goToMain = () => {
  currentView.value = 'main'
}

// 重置空闲计时器
const resetIdleTimer = () => {
  if (idleTimer) {
    clearTimeout(idleTimer)
  }
  hideHint()
  
  idleTimer = setTimeout(() => {
    showSmartHint()
  }, IDLE_TIMEOUT)
}

// 显示智能提示
const showSmartHint = () => {
  if (!currentLevelConfig.value || showLevelIntro.value || showLevelComplete.value || showGameOver.value) {
    return
  }
  
  const taskFruitIds = currentLevelConfig.value.tasks.map(t => t.fruitId)
  const hint = findBestHint(taskFruitIds)
  
  if (hint) {
    hintCells.value = [hint.cell1, hint.cell2]
    showHint.value = true
  }
}

// 隐藏提示
const hideHint = () => {
  showHint.value = false
  hintCells.value = null
}

// 处理游戏交互
const handleGameInteraction = () => {
  resetIdleTimer()
}

const startLevelGame = (level) => {
  currentLevel.value = level.id
  currentLevelConfig.value = level
  
  showLevelComplete.value = false
  showGameOver.value = false
  showLevelIntro.value = true
  
  currentView.value = 'game'
  startBackgroundMusic()
}

const closeLevelIntro = () => {
  showLevelIntro.value = false
  playGameStartSound()
  initLevel(currentLevelConfig.value)
  resetIdleTimer()
}

const getFruitEmoji = (fruitId) => {
  return GEM_TYPES[fruitId]?.emoji || '🍎'
}

const getFruitName = (fruitId) => {
  return GEM_TYPES[fruitId]?.name || '水果'
}

const getObstacleEmoji = (obstacleType) => {
  switch (obstacleType) {
    case 'ice':
    case 'ice2':
      return '❄️'
    case 'chain':
      return '⛓️'
    case 'block':
      return '🪨'
    default:
      return '❓'
  }
}

const getObstacleName = (obstacleType) => {
  switch (obstacleType) {
    case 'ice':
    case 'ice2':
      return '冰块'
    case 'chain':
      return '锁链'
    case 'block':
      return '障碍'
    default:
      return '未知'
  }
}

const getTaskProgress = (task) => {
  let current = 0
  if (task.type === 'fruits') {
    current = gameLogicTaskProgress[`fruit_${task.fruitId}`] || 0
  } else if (task.type === 'obstacles') {
    current = gameLogicTaskProgress[`obstacle_${task.obstacleType}`] || 0
  } else if (task.type === 'score') {
    current = score.value
    return Math.min(100, (current / task.score) * 100)
  }
  return Math.min(100, (current / task.count) * 100)
}

const getTaskCurrent = (task) => {
  if (task.type === 'fruits') {
    return gameLogicTaskProgress[`fruit_${task.fruitId}`] || 0
  } else if (task.type === 'obstacles') {
    return gameLogicTaskProgress[`obstacle_${task.obstacleType}`] || 0
  } else if (task.type === 'score') {
    return score.value
  }
  return 0
}

const getTaskTarget = (task) => {
  if (task.type === 'score') {
    return task.score
  }
  return task.count
}

const checkLevelComplete = () => {
  // 临时调试信息
  console.log('检查关卡完成状态...')
  console.log('checkWin:', checkWin.value)
  console.log('checkLose:', checkLose.value)
  console.log('moves:', moves.value)
  
  // 检查所有任务是否完成
  let allTasksCompleted = true
  if (currentLevelConfig.value) {
    currentLevelConfig.value.tasks.forEach(task => {
      const current = getTaskCurrent(task)
      const target = getTaskTarget(task)
      console.log(`任务: ${JSON.stringify(task)}, 当前: ${current}, 目标: ${target}`)
      if (current < target) {
        allTasksCompleted = false
      }
    })
  }
  
  console.log('所有任务完成:', allTasksCompleted)
  
  if (checkWin.value || allTasksCompleted) {
    console.log('🎉 关卡完成！')
    showLevelComplete.value = true
    unlockLevel(currentLevel.value + 1)
    
    // 保存完成状态
    const completed = localStorage.getItem('completedLevels')
    const completedLevels = completed ? JSON.parse(completed) : []
    if (!completedLevels.includes(currentLevel.value)) {
      completedLevels.push(currentLevel.value)
      localStorage.setItem('completedLevels', JSON.stringify(completedLevels))
    }
  } else if (checkLose.value) {
    console.log('😢 游戏失败！')
    showGameOver.value = true
  }
}

const resetCurrentLevel = () => {
  showLevelComplete.value = false
  showGameOver.value = false
  initLevel(currentLevelConfig.value)
}

// 添加游戏逻辑监听器
let removeMatchListener = null
let removeMoveListener = null

const setupGameListeners = () => {
  removeMatchListener = addMatchListener(() => {
    checkLevelComplete()
  })
  
  removeMoveListener = addMoveListener(() => {
    checkLevelComplete()
  })
}

const nextLevel = () => {
  const nextLevelId = currentLevel.value + 1
  const nextLevelConfig = LEVELS.find(l => l.id === nextLevelId)
  
  if (nextLevelConfig) {
    startLevelGame(nextLevelConfig)
  } else {
    exitToLevels()
  }
}

const exitToLevels = () => {
  currentView.value = 'levels'
}

const getLeafStyle = (n) => {
  const left = Math.random() * 100
  const delay = Math.random() * 8
  const duration = 10 + Math.random() * 10
  const size = 20 + Math.random() * 20
  const colors = ['#FFA07A', '#FFD700', '#90EE90', '#98FB98', '#ADFF2F', '#FFE4B5']
  const color = colors[n % colors.length]
  
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color
  }
}

onMounted(() => {
  startBackgroundMusic()
  setupGameListeners()
})
</script>

<style>
:root {
  --candy-pink: #FF6B9D;
  --candy-pink-light: #FFB6C1;
  --mint-green: #7FDBCA;
  --sunny-yellow: #FFD93D;
  --lavender: #E8D5F2;
  --light-pink: #FFE5EC;
  --gold: #FFD700;
  --pearl-white: #FFF8F0;
  --candy-purple: #9B59B6;
  --candy-blue: #5DADE2;
  --shadow-soft: rgba(255, 107, 157, 0.3);
  --shadow-glow: rgba(255, 107, 157, 0.5);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow-x: hidden;
}

.app-container {
  min-height: 100vh;
}

.game-container {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(180deg, var(--lavender) 0%, var(--light-pink) 100%);
}

/* 糖果梦幻天空背景 */
.game-sky {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 65%;
  background: linear-gradient(180deg, 
    #E8D5F2 0%, 
    #F8E1F4 30%, 
    #FFE5EC 60%, 
    #FFF0F5 100%);
}

/* 梦幻太阳 */
.game-sun {
  position: absolute;
  top: 4%;
  right: 8%;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, #FFE5EC 0%, var(--candy-pink) 50%, #FF9EBD 100%);
  border-radius: 50%;
  box-shadow: 
    0 0 30px var(--candy-pink),
    0 0 60px var(--shadow-glow),
    0 0 100px var(--shadow-soft);
  animation: candyGlow 3s ease-in-out infinite;
}

@keyframes candyGlow {
  0%, 100% { 
    box-shadow: 0 0 30px var(--candy-pink), 0 0 60px var(--shadow-glow), 0 0 100px var(--shadow-soft);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 50px var(--candy-pink), 0 0 80px var(--shadow-glow), 0 0 120px var(--shadow-soft);
    transform: scale(1.05);
  }
}

/* 梦幻云朵 */
.game-cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  opacity: 0.95;
  box-shadow: 0 5px 20px rgba(255, 182, 193, 0.3);
}

.game-cloud::before, .game-cloud::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  box-shadow: 0 3px 15px rgba(255, 182, 193, 0.2);
}

.game-cloud-1 {
  width: 120px;
  height: 45px;
  top: 8%;
  left: 6%;
  animation: candyCloudFloat 18s ease-in-out infinite;
}

.game-cloud-1::before {
  width: 55px;
  height: 55px;
  top: -28px;
  left: 18px;
}

.game-cloud-1::after {
  width: 70px;
  height: 50px;
  top: -22px;
  left: 45px;
}

.game-cloud-2 {
  width: 95px;
  height: 38px;
  top: 14%;
  right: 12%;
  animation: candyCloudFloat 22s ease-in-out infinite reverse;
}

.game-cloud-2::before {
  width: 48px;
  height: 48px;
  top: -24px;
  left: 12px;
}

.game-cloud-2::after {
  width: 58px;
  height: 45px;
  top: -18px;
  left: 38px;
}

@keyframes candyCloudFloat {
  0%, 100% { transform: translateX(0) translateY(0); }
  25% { transform: translateX(20px) translateY(-8px); }
  50% { transform: translateX(40px) translateY(0); }
  75% { transform: translateX(20px) translateY(8px); }
}

/* 糖果梦幻草地 */
.game-grass {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 45%;
  background: linear-gradient(180deg, 
    var(--mint-green) 0%, 
    #6BC9B8 40%, 
    #5BB8A8 100%);
  border-radius: 50% 50% 0 0 / 25% 25% 0 0;
  box-shadow: inset 0 5px 20px rgba(255, 255, 255, 0.3);
}

.game-grass-blades {
  position: absolute;
  top: -12px;
  left: 0;
  width: 100%;
  height: 40px;
}

.game-blade {
  position: absolute;
  bottom: 0;
  width: 5px;
  background: linear-gradient(to top, var(--mint-green), #A8E6CF);
  border-radius: 50% 50% 0 0;
  animation: candyBladeSway 2.5s ease-in-out infinite;
  transform-origin: bottom center;
}

@keyframes candyBladeSway {
  0%, 100% { transform: rotate(-6deg); }
  50% { transform: rotate(6deg); }
}

/* 飘落糖果装饰 */
.game-leaves-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 5;
}

.game-leaf {
  position: absolute;
  top: -30px;
  border-radius: 50% 0 50% 50%;
  animation: candyFall linear infinite;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.game-leaf:nth-child(odd) {
  background: linear-gradient(135deg, var(--candy-pink) 0%, #FFB6C1 100%);
}

.game-leaf:nth-child(even) {
  background: linear-gradient(135deg, var(--mint-green) 0%, #A8E6CF 100%);
}

.game-leaf:nth-child(3n) {
  background: linear-gradient(135deg, var(--sunny-yellow) 0%, #FFE066 100%);
}

@keyframes candyFall {
  0% {
    transform: translateY(-30px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

.game-content-wrapper {
  position: relative;
  z-index: 10;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 糖果风格游戏头部 */
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 18px 25px;
  background: linear-gradient(145deg, var(--pearl-white) 0%, var(--candy-pink-light) 50%, var(--candy-pink) 100%);
  border-radius: 25px;
  border: 4px solid var(--candy-pink);
  box-shadow: 
    0 8px 32px var(--shadow-glow),
    inset 0 2px 4px rgba(255, 255, 255, 0.8),
    0 0 20px var(--shadow-soft);
}

.game-header .logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.game-header .logo-icon {
  font-size: 1.8rem;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.2));
  animation: logoBounce 2s ease-in-out infinite;
}

@keyframes logoBounce {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-5px) rotate(3deg); }
}

.game-header h1 {
  font-size: 1.6rem;
  color: var(--candy-pink);
  margin: 0;
  text-shadow: 
    0 2px 4px rgba(255, 107, 157, 0.3),
    0 0 10px rgba(255, 255, 255, 0.5);
  font-weight: 800;
}

.game-header .score-board {
  display: flex;
  gap: 25px;
}

.game-header .score-item {
  text-align: center;
  background: rgba(255, 255, 255, 0.6);
  padding: 10px 20px;
  border-radius: 15px;
  border: 3px solid var(--mint-green);
  box-shadow: 0 4px 15px rgba(127, 219, 202, 0.3);
}

.game-header .score-label {
  font-size: 0.85rem;
  color: var(--candy-purple);
  display: block;
  font-weight: 600;
  letter-spacing: 1px;
}

.game-header .score-value {
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--candy-pink);
  text-shadow: 0 2px 4px rgba(255, 107, 157, 0.3);
}

.game-header .level-badge {
  background: linear-gradient(145deg, var(--gold) 0%, #FFC107 50%, #FFE066 100%);
  padding: 8px 18px;
  border-radius: 25px;
  font-weight: bold;
  color: var(--candy-purple);
  border: 3px solid var(--gold);
  box-shadow: 
    0 4px 15px rgba(255, 215, 0, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.6);
  animation: badgeShine 2s ease-in-out infinite;
}

@keyframes badgeShine {
  0%, 100% { box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.6); }
  50% { box-shadow: 0 4px 25px rgba(255, 215, 0, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 215, 0, 0.3); }
}

.game-header .btn-group {
  display: flex;
  gap: 12px;
}

.game-header button {
  padding: 12px 18px;
  border-radius: 15px;
  border: 3px solid var(--candy-pink);
  background: linear-gradient(145deg, #FFFFFF 0%, var(--pearl-white) 50%, var(--light-pink) 100%);
  color: var(--candy-pink);
  cursor: pointer;
  font-weight: bold;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 
    0 4px 15px var(--shadow-soft),
    inset 0 2px 4px rgba(255, 255, 255, 0.8);
}

.game-header button:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 
    0 8px 25px var(--shadow-glow),
    inset 0 2px 4px rgba(255, 255, 255, 0.8),
    0 0 20px var(--shadow-soft);
}

.game-content {
  flex: 1;
  display: flex;
  gap: 25px;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
}

/* 糖果风格游戏框 */
.wooden-frame {
  position: relative;
  padding: 22px;
  background: linear-gradient(145deg, var(--candy-pink) 0%, #FF5887 50%, #E85A7F 100%);
  border-radius: 30px;
  box-shadow: 
    0 12px 40px var(--shadow-glow),
    inset 0 3px 0 rgba(255, 255, 255, 0.2),
    0 0 30px var(--shadow-soft);
  border: 5px solid var(--candy-pink);
}

.wooden-frame::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 10px;
  background: linear-gradient(90deg, var(--gold) 0%, #FFE066 50%, var(--gold) 100%);
  border-radius: 25px 25px 0 0;
  opacity: 0.9;
}

.frame-top, .frame-bottom, .frame-left, .frame-right {
  position: absolute;
  background: linear-gradient(90deg, var(--candy-pink-light) 0%, var(--candy-pink) 50%, var(--candy-pink-light) 100%);
  border-radius: 8px;
}

.frame-top {
  top: 12px;
  left: 22px;
  right: 22px;
  height: 18px;
}

.frame-bottom {
  bottom: 12px;
  left: 22px;
  right: 22px;
  height: 18px;
}

.frame-left {
  left: 12px;
  top: 22px;
  bottom: 22px;
  width: 18px;
}

.frame-right {
  right: 12px;
  top: 22px;
  bottom: 22px;
  width: 18px;
}

.frame-corner {
  position: absolute;
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, var(--gold) 0%, #FFC107 100%);
  border-radius: 8px;
  border: 3px solid #FFF8E1;
  box-shadow: 0 3px 10px rgba(255, 215, 0, 0.4);
}

.corner-tl {
  top: 6px;
  left: 6px;
}

.corner-tr {
  top: 6px;
  right: 6px;
}

.corner-bl {
  bottom: 6px;
  left: 6px;
}

.corner-br {
  bottom: 6px;
  right: 6px;
}

.game-board-wrapper {
  background: linear-gradient(145deg, var(--pearl-white) 0%, var(--light-pink) 50%, var(--candy-pink-light) 100%);
  padding: 18px;
  border-radius: 20px;
  box-shadow: 
    inset 0 4px 15px rgba(255, 107, 157, 0.2),
    0 5px 20px rgba(0, 0, 0, 0.1);
  border: 4px solid var(--candy-pink-light);
}

.game-sidebar {
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: 300px;
}

.wooden-card {
  position: relative;
  background: linear-gradient(145deg, var(--pearl-white) 0%, var(--candy-pink-light) 50%, var(--candy-pink) 100%);
  border-radius: 22px;
  padding: 22px;
  box-shadow: 
    0 8px 32px var(--shadow-glow),
    inset 0 2px 4px rgba(255, 255, 255, 0.8);
  border: 4px solid var(--candy-pink);
}

.wooden-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: linear-gradient(90deg, var(--mint-green) 0%, #A8E6CF 50%, var(--mint-green) 100%);
  border-radius: 18px 18px 0 0;
  opacity: 0.9;
}

.wooden-card .card-top, .wooden-card .card-bottom {
  position: absolute;
  left: 12px;
  right: 12px;
  height: 10px;
  background: linear-gradient(90deg, var(--candy-pink) 0%, var(--candy-pink-light) 50%, var(--candy-pink) 100%);
  border-radius: 6px;
}

.wooden-card .card-top {
  top: 10px;
}

.wooden-card .card-bottom {
  bottom: 10px;
}

.wooden-card .card-content {
  position: relative;
  z-index: 1;
}

.wooden-card h3 {
  color: var(--candy-pink);
  margin-bottom: 18px;
  font-size: 1.2rem;
  text-shadow: 0 2px 4px rgba(255, 107, 157, 0.3);
  font-weight: 700;
}

.info-card ul {
  list-style: none;
  padding: 0;
}

.info-card li {
  color: var(--candy-purple);
  margin-bottom: 10px;
  padding-left: 22px;
  position: relative;
}

.info-card li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--mint-green);
  font-weight: bold;
}

.task-progress {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.task-emoji {
  font-size: 1.5rem;
}

.task-bar-container {
  flex: 1;
  height: 14px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 7px;
  overflow: hidden;
  border: 2px solid var(--candy-pink-light);
  box-shadow: inset 0 2px 5px rgba(255, 107, 157, 0.2);
}

.task-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--mint-green) 0%, #A8E6CF 50%, var(--sunny-yellow) 100%);
  border-radius: 7px;
  transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 2px 8px rgba(127, 219, 202, 0.4);
}

.task-text {
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--candy-pink);
  min-width: 55px;
  text-align: right;
  text-shadow: 0 1px 2px rgba(255, 107, 157, 0.2);
}

.moves-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 18px;
  padding-top: 18px;
  border-top: 3px dashed var(--candy-pink-light);
}

.moves-icon {
  font-size: 1.4rem;
}

.moves-text {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--candy-pink);
  text-shadow: 0 2px 4px rgba(255, 107, 157, 0.2);
}

.gems-preview .gems-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.gem-preview-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  border: 2px solid var(--mint-green);
  box-shadow: 0 3px 10px rgba(127, 219, 202, 0.2);
  transition: all 0.3s ease;
}

.gem-preview-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(127, 219, 202, 0.3);
}

.gem-emoji {
  font-size: 1.8rem;
}

.gem-name {
  font-size: 0.85rem;
  color: var(--candy-purple);
  text-align: center;
  font-weight: 600;
}

.level-intro-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(232, 213, 242, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.3s ease;
  backdrop-filter: blur(10px);
}

.level-intro-modal {
  background: linear-gradient(145deg, var(--pearl-white) 0%, var(--lavender) 50%, var(--light-pink) 100%);
  border: 5px solid var(--candy-pink);
  border-radius: 35px;
  padding: 45px;
  text-align: center;
  max-width: 450px;
  width: 90%;
  box-shadow: 
    0 30px 80px var(--shadow-glow),
    0 0 50px var(--shadow-soft),
    inset 0 3px 0 rgba(255, 255, 255, 0.8);
  animation: candySlideUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
}

.level-intro-modal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 12px;
  background: linear-gradient(90deg, var(--mint-green) 0%, var(--sunny-yellow) 50%, var(--candy-pink) 100%);
}

.level-intro-modal::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 60%);
  pointer-events: none;
}

.level-intro-modal .modal-header {
  margin-bottom: 25px;
}

.level-intro-modal .modal-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 15px;
  animation: modalIconBounce 2s ease-in-out infinite;
}

@keyframes modalIconBounce {
  0%, 100% { transform: scale(1) rotate(-3deg); }
  50% { transform: scale(1.1) rotate(3deg); }
}

.level-intro-modal h2 {
  font-size: 1.8rem;
  color: var(--candy-pink);
  margin: 0;
  text-shadow: 0 2px 4px rgba(255, 107, 157, 0.3);
}

.level-intro-modal .level-name {
  font-size: 1.2rem;
  color: var(--candy-purple);
  font-weight: bold;
}

.modal-desc {
  font-size: 1.1rem;
  color: var(--candy-purple);
  margin-bottom: 25px;
}

.intro-tasks {
  margin-bottom: 25px;
}

.intro-tasks h4 {
  font-size: 1.2rem;
  color: var(--candy-pink);
  margin: 0 0 18px 0;
  text-shadow: 0 2px 4px rgba(255, 107, 157, 0.2);
}

.intro-task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.intro-task-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 15px;
  border: 2px solid var(--mint-green);
  box-shadow: 0 3px 10px rgba(127, 219, 202, 0.2);
}

.intro-task-item .task-emoji {
  font-size: 1.8rem;
}

.intro-task-item .task-text {
  font-size: 1.05rem;
  color: var(--candy-purple);
  font-weight: 600;
}

.intro-stats {
  margin-bottom: 25px;
}

.intro-stats .stat-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 15px;
  border: 2px solid var(--gold);
}

.intro-stats .stat-icon {
  font-size: 1.5rem;
}

.intro-stats .stat-text {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--candy-purple);
}

.tap-hint {
  font-size: 1rem;
  color: var(--candy-pink);
  opacity: 0.9;
  animation: candyPulse 1.5s ease-in-out infinite;
  font-weight: 600;
}

@keyframes candyPulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

.level-complete-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(232, 213, 242, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.3s ease;
  backdrop-filter: blur(12px);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.level-complete-modal {
  background: linear-gradient(145deg, var(--pearl-white) 0%, var(--lavender) 50%, var(--light-pink) 100%);
  border: 5px solid var(--candy-pink);
  border-radius: 35px;
  padding: 50px;
  text-align: center;
  max-width: 450px;
  width: 90%;
  box-shadow: 
    0 30px 80px var(--shadow-glow),
    0 0 60px var(--shadow-soft),
    inset 0 3px 0 rgba(255, 255, 255, 0.8);
  animation: candySlideUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
}

@keyframes candySlideUp {
  from {
    transform: translateY(60px) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.level-complete-modal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 14px;
  background: linear-gradient(90deg, var(--gold) 0%, var(--sunny-yellow) 50%, var(--gold) 100%);
}

.level-complete-modal::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 60%);
  pointer-events: none;
  animation: modalShine 3s ease-in-out infinite;
}

@keyframes modalShine {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.level-complete-modal.game-over {
  background: linear-gradient(145deg, #FFE4EC 0%, var(--light-pink) 50%, #FFCCD5 100%);
  border-color: var(--candy-pink);
}

.level-complete-modal.game-over::before {
  background: linear-gradient(90deg, var(--candy-pink-light) 0%, var(--candy-pink) 50%, var(--candy-pink-light) 100%);
}

.modal-header {
  margin-bottom: 25px;
}

.modal-icon {
  font-size: 4.5rem;
  display: block;
  margin-bottom: 12px;
  animation: modalIconBounce 2s ease-in-out infinite;
}

.modal-header h2 {
  font-size: 2rem;
  color: var(--candy-pink);
  margin: 0;
  text-shadow: 0 2px 4px rgba(255, 107, 157, 0.3);
}

.modal-message {
  font-size: 1.2rem;
  color: var(--candy-purple);
  margin-bottom: 25px;
}

.modal-score {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--gold);
  text-shadow: 
    0 2px 4px rgba(255, 215, 0, 0.4),
    0 0 15px rgba(255, 215, 0, 0.3);
  margin-bottom: 30px;
}

.modal-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.modal-btn {
  padding: 18px 35px;
  border-radius: 25px;
  border: 3px solid;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.retry-btn {
  background: linear-gradient(145deg, var(--pearl-white) 0%, var(--sunny-yellow) 50%, var(--gold) 100%);
  border-color: var(--gold);
  color: var(--candy-purple);
  box-shadow: 
    0 6px 20px rgba(255, 215, 0, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.8);
}

.next-btn {
  background: linear-gradient(145deg, #A8E6CF 0%, var(--mint-green) 50%, #6BC9B8 100%);
  border-color: var(--mint-green);
  color: #2E7D32;
  box-shadow: 
    0 6px 20px rgba(127, 219, 202, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.8);
}

.exit-btn {
  background: linear-gradient(145deg, #FFE4EC 0%, var(--candy-pink-light) 50%, var(--candy-pink) 100%);
  border-color: var(--candy-pink);
  color: #C2185B;
  box-shadow: 
    0 6px 20px var(--shadow-glow),
    inset 0 2px 4px rgba(255, 255, 255, 0.8);
}

.modal-btn:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.9);
}

@media (max-width: 1024px) {
  .game-content {
    flex-direction: column;
    align-items: center;
  }
  
  .game-sidebar {
    width: 100%;
    max-width: 560px;
  }
}

@media (max-width: 768px) {
  .game-header {
    flex-direction: column;
    gap: 18px;
    text-align: center;
    padding: 15px 20px;
  }
  
  .game-header .score-board {
    gap: 35px;
  }
  
  .game-header h1 {
    font-size: 1.5rem;
  }
  
  .game-header .logo-icon {
    font-size: 1.5rem;
  }
  
  .game-header .score-value {
    font-size: 1.3rem;
  }
  
  .game-content-wrapper {
    padding: 12px;
  }
  
  .wooden-frame {
    padding: 10px;
  }
  
  .game-board-wrapper {
    padding: 12px;
  }
  
  .level-intro-modal {
    padding: 30px 25px;
    max-width: 380px;
  }
  
  .level-intro-modal .modal-icon {
    font-size: 3.5rem;
  }
  
  .level-intro-modal h2 {
    font-size: 1.6rem;
  }
  
  .level-complete-modal {
    padding: 35px 25px;
    max-width: 380px;
  }
  
  .modal-header h2 {
    font-size: 1.7rem;
  }
  
  .modal-icon {
    font-size: 4rem;
  }
  
  .modal-btn {
    padding: 14px 25px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .game-header {
    padding: 12px 15px;
    gap: 12px;
  }
  
  .game-header h1 {
    font-size: 1.3rem;
  }
  
  .game-header .logo-icon {
    font-size: 1.3rem;
  }
  
  .game-header .score-board {
    gap: 25px;
  }
  
  .game-header .score-item {
    min-width: 70px;
  }
  
  .game-header .score-label {
    font-size: 0.8rem;
  }
  
  .game-header .score-value {
    font-size: 1.2rem;
  }
  
  .game-header .level-badge {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
  
  .game-content-wrapper {
    padding: 8px;
  }
  
  .wooden-frame {
    padding: 8px;
  }
  
  .game-board-wrapper {
    padding: 10px;
  }
  
  .game-sidebar {
    gap: 12px;
  }
  
  .wooden-card {
    padding: 18px;
  }
  
  .task-item {
    padding: 10px;
    gap: 10px;
  }
  
  .task-emoji {
    font-size: 1.4rem;
  }
  
  .task-text {
    font-size: 0.85rem;
  }
  
  .level-intro-modal {
    padding: 25px 18px;
    max-width: 320px;
  }
  
  .level-intro-modal .modal-icon {
    font-size: 3rem;
  }
  
  .level-intro-modal h2 {
    font-size: 1.4rem;
  }
  
  .level-intro-modal .level-name {
    font-size: 1rem;
  }
  
  .intro-task-item {
    padding: 12px;
    gap: 12px;
  }
  
  .intro-task-item .task-emoji {
    font-size: 1.5rem;
  }
  
  .intro-task-item .task-text {
    font-size: 0.95rem;
  }
  
  .tap-hint {
    font-size: 0.9rem;
  }
  
  .level-complete-modal {
    padding: 30px 18px;
    max-width: 320px;
  }
  
  .modal-header h2 {
    font-size: 1.5rem;
  }
  
  .modal-icon {
    font-size: 3.5rem;
  }
  
  .modal-message {
    font-size: 1.1rem;
  }
  
  .modal-btn {
    padding: 12px 18px;
    font-size: 0.95rem;
  }
  
  .back-btn {
    padding: 10px 18px;
    font-size: 0.95rem;
    top: 12px;
    left: 12px;
  }
  
  .level-title {
    font-size: 2.2rem;
  }
  
  .level-subtitle {
    font-size: 1.05rem;
  }
}

@media (max-width: 360px) {
  .game-header {
    padding: 10px 12px;
  }
  
  .game-header h1 {
    font-size: 1.2rem;
  }
  
  .game-header .score-board {
    gap: 18px;
  }
  
  .game-header .score-item {
    min-width: 60px;
  }
  
  .level-intro-modal {
    padding: 20px 15px;
    max-width: 290px;
  }
  
  .level-intro-modal h2 {
    font-size: 1.3rem;
  }
  
  .level-complete-modal {
    padding: 25px 15px;
    max-width: 290px;
  }
  
  .modal-header h2 {
    font-size: 1.4rem;
  }
  
  .level-title {
    font-size: 2rem;
  }
}
</style>
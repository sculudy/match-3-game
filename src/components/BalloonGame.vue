<template>
  <div class="balloon-game">
    <div class="game-header">
      <button class="back-btn" @click="$emit('back')">← 返回</button>
      <h1>🎈 打气球游戏 🎈</h1>
    </div>

    <div v-if="!isPlaying && !showResult" class="difficulty-select">
      <h2>选择难度</h2>
      <div class="difficulty-buttons">
        <button 
          v-for="(cfg, key) in DIFFICULTY_CONFIG" 
          :key="key"
          class="diff-btn"
          :class="key"
          @click="startGame(key)"
        >
          <span class="diff-name">{{ cfg.name }}</span>
          <span class="diff-info">{{ cfg.gridSize }}×{{ cfg.gridSize }} · {{ cfg.maxBalloons }}个气球</span>
        </button>
      </div>
    </div>

    <div v-else-if="isPlaying" class="game-area">
      <div class="game-stats">
        <div class="stat-item">
          <span class="stat-label">得分</span>
          <span class="stat-value">{{ score }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">连击</span>
          <span class="stat-value" :class="`combo-${comboLevel}`">{{ combo }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">时间</span>
          <span class="stat-value" :class="{ 'time-warning': timeLeft <= 10 }">{{ timeLeft }}s</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">每个</span>
          <span class="stat-value">{{ currentScorePerBalloon }}分</span>
        </div>
      </div>

      <div class="game-grid-wrapper">
        <div 
          class="game-grid"
          :style="gridStyle"
          @click="handleGridClick"
        >
          <div 
            v-for="row in config.gridSize" 
            :key="row"
            class="grid-row"
          >
            <div 
              v-for="col in config.gridSize" 
              :key="col"
              class="grid-cell"
            >
              <div 
                v-for="balloon in getBalloonsAt(row - 1, col - 1)" 
                :key="balloon.id"
                class="balloon"
                :class="{ 'balloon-new': balloon.isNew }"
                :style="{ backgroundColor: balloon.color }"
                @click.stop="popBalloon(balloon.id)"
              >
                <span class="balloon-emoji">{{ balloon.emoji }}</span>
              </div>
              
              <div 
                v-for="explosion in getExplosionsAt(row - 1, col - 1)" 
                :key="explosion.id"
                class="explosion"
                :style="{ borderColor: explosion.color }"
              >
                <span>💥</span>
              </div>
              
              <div 
                v-for="particle in getParticlesAt(row - 1, col - 1)" 
                :key="particle.id"
                class="particle"
                :class="`particle-${particle.type}`"
                :style="{ 
                  '--offset-x': `${particle.offsetX}px`,
                  '--offset-y': `${particle.offsetY}px`,
                  '--particle-size': `${particle.size}px`,
                  backgroundColor: particle.color 
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isPaused" class="pause-overlay">
        <div class="pause-content">
          <h2>⏸️ 游戏暂停</h2>
          <p>当前得分: {{ score }}</p>
          <button class="resume-btn" @click="togglePause">继续游戏</button>
        </div>
      </div>
    </div>

    <div v-else-if="showResult" class="result-screen">
      <h2>🎉 游戏结束！</h2>
      <div class="result-stats">
        <div class="result-item">
          <span class="result-label">最终得分</span>
          <span class="result-value">{{ score }}</span>
        </div>
        <div class="result-item">
          <span class="result-label">最高连击</span>
          <span class="result-value">{{ maxCombo }}</span>
        </div>
        <div class="result-item">
          <span class="result-label">难度</span>
          <span class="result-value">{{ config.name }}</span>
        </div>
      </div>
      <div class="result-buttons">
        <button class="result-btn" @click="startGame(difficulty)">再来一局</button>
        <button class="result-btn" @click="resetGameAndSelect">选择难度</button>
        <button class="result-btn" @click="$emit('back')">返回首页</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useBalloonGame } from '../composables/useBalloonGame'
import { DIFFICULTY_CONFIG } from '../constants/balloonConfig'

const emit = defineEmits(['back'])

const {
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
  resetGame,
  popBalloon,
  miss
} = useBalloonGame()

const showResult = ref(false)

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${config.value.gridSize}, 1fr)`,
  gridTemplateRows: `repeat(${config.value.gridSize}, 1fr)`
}))

const getBalloonsAt = (row, col) => {
  return balloons.value.filter(b => b.row === row && b.col === col)
}

const getExplosionsAt = (row, col) => {
  return explosions.value.filter(e => e.row === row && e.col === col)
}

const getParticlesAt = (row, col) => {
  return particles.value.filter(p => p.row === row && p.col === col)
}

const togglePause = () => {
  if (isPaused.value) {
    resumeGame()
  } else {
    pauseGame()
  }
}

const handleGridClick = () => {
  if (isPlaying.value && !isPaused.value) {
    miss()
  }
}

const resetGameAndSelect = () => {
  resetGame()
  showResult.value = false
}

watch(isPlaying, (newVal, oldVal) => {
  if (!newVal && oldVal) {
    showResult.value = true
  }
})
</script>

<style scoped>
.balloon-game {
  min-height: 100vh;
  background: linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 30%, #A5D6A7 60%, #81C784 100%);
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

.balloon-game::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='35' r='3' fill='%2366BB6A' fill-opacity='0.15'/%3E%3C/svg%3E");
  background-repeat: repeat;
  pointer-events: none;
}

.game-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
}

.back-btn {
  position: absolute;
  left: 20px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.back-btn:hover {
  transform: translateX(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.game-header h1 {
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-size: 2.5rem;
  margin: 0;
}

.difficulty-select {
  text-align: center;
  position: relative;
  z-index: 1;
}

.difficulty-select h2 {
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-size: 1.8rem;
  margin-bottom: 30px;
}

.difficulty-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 220px));
  justify-content: center;
  gap: 20px;
  max-width: 500px;
  margin: 0 auto;
}

.diff-btn {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 22px 35px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  min-width: 180px;
  backdrop-filter: blur(10px);
}

.diff-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.15);
}

.diff-btn.easy {
  background: linear-gradient(135deg, #81C784 0%, #66BB6A 100%);
}

.diff-btn.normal {
  background: linear-gradient(135deg, #FFB74D 0%, #FFA726 100%);
}

.diff-btn.hard {
  background: linear-gradient(135deg, #EF9A9A 0%, #E57373 100%);
}

.diff-name {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.diff-info {
  display: block;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 5px;
}

.game-area {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px;
}

.game-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 16px;
  padding: 12px 18px;
  margin-bottom: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  backdrop-filter: blur(10px);
}

.stat-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 4px;
  font-weight: 500;
}

.stat-value {
  display: block;
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
  min-width: 40px;
}

.stat-value.combo-1 { color: #333; }
.stat-value.combo-2 { color: #FF9800; animation: pulse 0.5s infinite; }
.stat-value.combo-3 { color: #F44336; animation: pulse 0.3s infinite; }

.stat-value.time-warning {
  color: #F44336;
  animation: blink 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.game-grid-wrapper {
  display: flex;
  justify-content: center;
  padding: 0;
}

.game-grid {
  display: grid;
  grid-row-gap: 8px;
  grid-column-gap: 8px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.grid-cell {
  width: 90px;
  height: 90px;
  background: transparent;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  cursor: crosshair;
  transition: all 0.2s ease;
  border: 2px dashed rgba(0, 0, 0, 0.1);
}

.grid-cell:hover {
  background: rgba(0, 0, 0, 0.03);
  border-color: rgba(0, 0, 0, 0.2);
}

.balloon {
  width: 82%;
  height: 82%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 
    inset -8px -8px 16px rgba(0, 0, 0, 0.15),
    inset 8px 8px 16px rgba(255, 255, 255, 0.6),
    0 3px 12px rgba(0, 0, 0, 0.15);
  animation: float 2.5s ease-in-out infinite;
}

.balloon:hover {
  transform: scale(1.1);
}

.balloon:active {
  transform: scale(0.95);
}

.balloon-new {
  animation: popIn 0.3s ease-out;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-6px) rotate(3deg); }
}

@keyframes popIn {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

.balloon-emoji {
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.explosion {
  position: absolute;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 4px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: explode 0.5s ease-out forwards;
}

.explosion span {
  font-size: 2rem;
}

@keyframes explode {
  0% { transform: scale(0.5); opacity: 1; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
}

.particle {
  position: absolute;
  border-radius: 50%;
  animation: particle-fly 1s ease-out forwards;
  pointer-events: none;
}

.particle-pink {
  box-shadow: 0 0 10px rgba(255, 107, 157, 0.8), 0 0 20px rgba(255, 107, 157, 0.5);
}

.particle-gold {
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.5);
  animation: particle-fly-gold 1s ease-out forwards;
}

@keyframes particle-fly {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--offset-x), var(--offset-y)) scale(0);
    opacity: 0;
  }
}

@keyframes particle-fly-gold {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translate(var(--offset-x), var(--offset-y)) scale(0);
    opacity: 0;
  }
}

.pause-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.pause-content {
  background: #fff;
  padding: 40px;
  border-radius: 25px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.pause-content h2 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.pause-content p {
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.result-screen {
  text-align: center;
  position: relative;
  z-index: 1;
  padding: 30px 20px;
}

.result-screen h2 {
  color: #fff;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  font-size: 2.2rem;
  margin-bottom: 25px;
}

.result-stats {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 18px;
  padding: 25px;
  margin-bottom: 25px;
  display: inline-block;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.result-item {
  margin-bottom: 15px;
}

.result-item:last-child {
  margin-bottom: 0;
}

.result-label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
}

.result-value {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

.result-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}

.result-btn {
  padding: 14px 35px;
  border: none;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  backdrop-filter: blur(10px);
}

.result-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .balloon-game {
    padding: 15px 10px;
  }
  
  .game-header h1 {
    font-size: 1.5rem;
  }
  
  .back-btn {
    padding: 8px 15px;
    font-size: 14px;
    left: 10px;
  }
  
  .game-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 12px 15px;
  }
  
  .stat-item {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }
  
  .stat-label {
    font-size: 0.7rem;
    margin-bottom: 0;
  }
  
  .stat-value {
    font-size: 1.1rem;
    min-width: 30px;
  }
  
  .grid-cell {
    width: 70px;
    height: 70px;
  }
  
  .balloon-emoji {
    font-size: 1.5rem;
  }
  
  .difficulty-buttons {
    grid-template-columns: 1fr;
    max-width: 280px;
  }
  
  .diff-btn {
    padding: 20px 30px;
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .grid-cell {
    width: 55px;
    height: 55px;
    gap: 6px;
  }
  
  .balloon-emoji {
    font-size: 1.2rem;
  }
}
</style>
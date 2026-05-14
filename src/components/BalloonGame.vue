<template>
  <div class="balloon-game">
    <!-- 全屏粒子特效 -->
    <div class="fullscreen-particles">
      <div
        v-for="particle in fullscreenParticles"
        :key="particle.id"
        class="fullscreen-particle"
        :class="`fullscreen-particle-${particle.type}`"
        :style="{
          left: `${particle.startX}%`,
          top: `${particle.startY}%`,
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          backgroundColor: particle.color,
          '--offsetX': `${particle.offsetX}px`,
          '--offsetY': `${particle.offsetY}px`,
          animationDelay: `${particle.delay}s`,
          borderRadius: particle.id % 3 === 0 ? '50%' : particle.id % 3 === 1 ? '30%' : '0'
        }"
      >
        <span v-if="particle.id % 4 === 0" class="particle-emoji">✨</span>
        <span v-else-if="particle.id % 4 === 1" class="particle-emoji">⭐</span>
      </div>
    </div>
    
    <div class="game-header">
      <button class="back-btn" @click="$emit('back')">← 返回</button>
      <h1>🎈 打气球游戏 🎈</h1>
    </div>

    <div v-if="!isPlaying && !showResult" class="difficulty-select">
      <div class="difficulty-wrapper">
        <div class="records-panel">
          <h3 v-if="selectedDifficulty" class="records-title">
            {{ DIFFICULTY_CONFIG[selectedDifficulty].name }} 成绩记录
          </h3>
          <h3 v-else class="records-title">选择难度查看记录</h3>
          <div class="records-list">
            <div v-if="currentRecords.length > 0" class="record-item" v-for="(record, index) in currentRecords" :key="index">
              <div class="record-rank">#{{ index + 1 }}</div>
              <div class="record-details">
                <div class="record-score">{{ record.score }}分</div>
                <div class="record-stats">
                  <span>最高连击: {{ record.maxCombo }}</span>
                  <span>最快反应: {{ record.fastestReaction }}ms</span>
                </div>
                <div class="record-date">{{ record.date }}</div>
              </div>
            </div>
            <div v-else class="no-records">暂无记录</div>
          </div>
        </div>
        
        <div class="difficulty-main">
          <h2>选择难度</h2>
          <div class="difficulty-buttons">
            <button 
              v-for="(cfg, key) in DIFFICULTY_CONFIG" 
              :key="key"
              class="diff-btn"
              :class="key"
              @click="handleDifficultySelect(key)"
              :data-selected="selectedDifficulty === key"
            >
              <span class="diff-name">{{ cfg.name }}</span>
              <span class="diff-info">{{ cfg.gridSize }}×{{ cfg.gridSize }} · {{ cfg.maxBalloons }}个气球</span>
            </button>
          </div>
          <button 
            v-if="selectedDifficulty"
            class="start-game-btn"
            @click="startGame(selectedDifficulty)"
          >
            开始游戏
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="isPlaying" class="game-area">
      <!-- 漫画风格连击数字 -->
      <div v-if="combo >= 7" class="combo-display">
        <div class="combo-number" :key="combo">{{ combo }}</div>
        <div class="combo-text">连击!</div>
        <div class="combo-multiple">×{{ combo}}</div>
      </div>
      
      <div class="game-layout">
        <!-- 左侧记录面板 -->
        <div class="side-panel left-panel">
          <div class="panel-title">📊 本游戏记录</div>
          <div class="record-item small-record">
            <div class="record-detail">
              <span class="record-detail-label">当前得分</span>
              <span class="record-detail-value">{{ score }}</span>
            </div>
          </div>
          <div class="record-item small-record">
            <div class="record-detail">
              <span class="record-detail-label">最高连击</span>
              <span class="record-detail-value">{{ maxCombo }}</span>
            </div>
          </div>
          <div v-if="fastestReaction !== Infinity" class="record-item small-record">
            <div class="record-detail">
              <span class="record-detail-label">最快反应</span>
              <span class="record-detail-value">{{ fastestReaction }}ms</span>
            </div>
          </div>
        </div>

        <!-- 中间游戏区域 -->
        <div class="game-main">
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
        </div>

        <!-- 右侧反应时间面板 -->
        <div class="side-panel right-panel">
          <div class="panel-title">⚡ 反应时间</div>
          <div class="reaction-display" :class="{ 'reaction-pop': lastReaction }">
            <div class="reaction-value">{{ lastReaction || '-' }}ms</div>
            <div class="reaction-label">上次点击</div>
          </div>
          <div v-if="fastestReaction !== Infinity" class="fastest-display">
            <div class="fastest-value">{{ fastestReaction }}ms</div>
            <div class="fastest-label">本游戏最快</div>
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
import { ref, computed, watch, onMounted } from 'vue'
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
  fullscreenParticles,
  fastestReaction,
  lastReaction,
  config,
  currentScorePerBalloon,
  comboLevel,
  startGame,
  pauseGame,
  resumeGame,
  resetGame,
  popBalloon,
  miss,
  loadGameRecords,
  getRecordsByDifficulty
} = useBalloonGame()

const selectedDifficulty = ref(null)

onMounted(() => {
  loadGameRecords()
})

const currentRecords = computed(() => {
  if (selectedDifficulty.value) {
    return getRecordsByDifficulty(selectedDifficulty.value)
  }
  return []
})

const handleDifficultySelect = (diff) => {
  selectedDifficulty.value = diff
}

const showResult = ref(false)

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${config.value.gridSize}, 1fr)`
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

/* 全屏粒子特效容器 */
.fullscreen-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
  overflow: hidden;
}

/* 全屏粒子样式 */
.fullscreen-particle {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: fullscreenParticleFly 1.2s ease-out forwards;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 粒子emoji */
.particle-emoji {
  font-size: 16px;
  position: absolute;
  z-index: 1;
}

/* 粉色粒子特效 */
.fullscreen-particle-pink {
  box-shadow: 
    0 0 10px rgba(255, 107, 157, 0.8),
    0 0 20px rgba(255, 107, 157, 0.5),
    0 0 30px rgba(255, 107, 157, 0.3);
}

/* 金色粒子特效 */
.fullscreen-particle-gold {
  box-shadow: 
    0 0 10px rgba(255, 215, 0, 0.8),
    0 0 20px rgba(255, 215, 0, 0.5),
    0 0 30px rgba(255, 215, 0, 0.3);
}

/* 紫色粒子特效 */
.fullscreen-particle-purple {
  box-shadow: 
    0 0 10px rgba(155, 89, 182, 0.8),
    0 0 20px rgba(155, 89, 182, 0.5),
    0 0 30px rgba(155, 89, 182, 0.3);
}

/* 全屏粒子飞行动画 - 从四周向内侧飘动，平滑过渡 */
@keyframes fullscreenParticleFly {
  0% {
    transform: translate(-50%, -50%) scale(0.2);
    opacity: 0;
  }
  15% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  85% {
    transform: translate(calc(-50% + var(--offsetX) * 0.8), calc(-50% + var(--offsetY) * 0.8)) scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: translate(calc(-50% + var(--offsetX)), calc(-50% + var(--offsetY))) scale(0.5);
    opacity: 0;
  }
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

.difficulty-wrapper {
  display: flex;
  gap: 30px;
  width: 100%;
  max-width: 1000px;
}

.records-panel {
  flex: 0 0 300px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.records-title {
  font-size: 1.2rem;
  color: #333;
  margin: 0 0 15px 0;
  text-align: center;
}

.records-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 400px;
}

.record-item {
  display: flex;
  gap: 15px;
  align-items: flex-start;
  padding: 12px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  border-radius: 12px;
  border-left: 4px solid #FF6B9D;
}

.record-rank {
  font-size: 1.5rem;
  font-weight: 900;
  color: #FF6B9D;
  min-width: 40px;
}

.record-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.record-score {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
}

.record-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 0.85rem;
  color: #666;
}

.record-stats span {
  background: rgba(255, 107, 157, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
}

.record-date {
  font-size: 0.75rem;
  color: #999;
}

.no-records {
  text-align: center;
  color: #999;
  padding: 30px 10px;
}

.difficulty-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.difficulty-select h2 {
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-size: 1.8rem;
  margin-bottom: 30px;
}

.diff-btn[data-selected="true"] {
  transform: scale(1.05);
  border: 3px solid #FFD700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
}

.start-game-btn {
  padding: 15px 50px;
  font-size: 1.3rem;
  font-weight: 700;
  border: none;
  border-radius: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.start-game-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
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
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px;
  min-height: 400px;
}

.game-layout {
  display: flex;
  gap: 20px;
  width: 100%;
  align-items: flex-start;
  justify-content: center;
}

.game-main {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.side-panel {
  flex: 0 0 180px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel-title {
  font-size: 1rem;
  font-weight: 700;
  color: #333;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 2px dashed rgba(0, 0, 0, 0.1);
  margin-bottom: 5px;
}

.small-record {
  padding: 10px !important;
  border-radius: 10px;
}

.record-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.record-detail-label {
  font-size: 0.8rem;
  color: #666;
}

.record-detail-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
}

.reaction-display {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 15px 10px;
  text-align: center;
  color: white;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.reaction-pop {
  animation: reaction-pop 0.3s ease-out;
}

@keyframes reaction-pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

.reaction-value {
  font-size: 2rem;
  font-weight: 900;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
}

.reaction-label {
  font-size: 0.8rem;
  opacity: 0.9;
  margin-top: 4px;
}

.fastest-display {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 12px;
  padding: 12px 8px;
  text-align: center;
  color: white;
}

.fastest-value {
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);
}

.fastest-label {
  font-size: 0.75rem;
  opacity: 0.9;
  margin-top: 3px;
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
  grid-row-gap: 15px;
  grid-column-gap: 15px;
  padding: 25px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 28px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.grid-cell {
  width: 150px;
  height: 150px;
  background: transparent;
  border-radius: 16px;
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
  font-size: 3.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.explosion {
  position: absolute;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 4px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: explode 0.5s ease-out forwards;
}

.explosion span {
  font-size: 3rem;
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
  
  .difficulty-wrapper {
    flex-direction: column-reverse;
    max-width: 400px;
  }
  
  .records-panel {
    flex: none;
    width: 100%;
    max-height: 250px;
  }
  
  .combo-display {
    right: 2%;
    top: 15%;
  }
  
  .combo-number {
    font-size: 3.5rem;
  }
  
  .combo-text {
    font-size: 1.8rem;
  }
  
  .combo-multiple {
    font-size: 1.4rem;
  }
  
  .game-layout {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  
  .side-panel {
    flex: none;
    width: 100%;
    max-width: 400px;
  }
  
  .left-panel, .right-panel {
    order: 2;
  }
  
  .game-main {
    order: 1;
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

/* 漫画风格连击显示 */
.combo-display {
  position: absolute;
  right: 5%;
  top: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
}

.combo-number {
  font-size: 5rem;
  font-weight: 900;
  color: #FF6B6B;
  text-shadow: 
    4px 4px 0px #FFD93D,
    8px 8px 0px #333,
    0 0 20px rgba(255, 107, 107, 0.5);
  font-family: 'Impact', 'Arial Black', sans-serif;
  letter-spacing: -2px;
  animation: comboPopIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55), comboBounce 0.5s ease-out 0.3s, comboShake 0.3s ease-in-out 0.5s;
  transform: rotate(-5deg);
}

.combo-text {
  font-size: 2.5rem;
  font-weight: 900;
  color: #FFD93D;
  text-shadow: 
    3px 3px 0px #FF6B6B,
    6px 6px 0px #333;
  font-family: 'Impact', 'Arial Black', sans-serif;
  margin-top: -10px;
  animation: comboTextIn 0.4s ease-out 0.2s both;
  transform: rotate(3deg);
}

.combo-multiple {
  font-size: 2rem;
  font-weight: 900;
  color: #9B59B6;
  text-shadow: 
    2px 2px 0px #FFD93D,
    4px 4px 0px #333;
  font-family: 'Impact', 'Arial Black', sans-serif;
  margin-top: 5px;
  animation: comboMultipleIn 0.4s ease-out 0.4s both;
  transform: rotate(-2deg);
}

/* 连击弹出动画 */
@keyframes comboPopIn {
  0% {
    transform: scale(0) rotate(20deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(-5deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

/* 连击数字跳动动画 */
@keyframes comboBounce {
  0%, 100% {
    transform: rotate(-5deg) scale(1);
  }
  25% {
    transform: rotate(-10deg) scale(1.1);
  }
  50% {
    transform: rotate(-5deg) scale(1.05);
  }
  75% {
    transform: rotate(0deg) scale(1.08);
  }
}

/* 连击抖动效果 */
@keyframes comboShake {
  0%, 100% {
    transform: rotate(-5deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(0deg);
  }
}

/* 连击文字入场动画 */
@keyframes comboTextIn {
  0% {
    transform: translateX(50px) rotate(15deg);
    opacity: 0;
  }
  100% {
    transform: translateX(0) rotate(3deg);
    opacity: 1;
  }
}

/* 倍数文字入场动画 */
@keyframes comboMultipleIn {
  0% {
    transform: translateY(30px) rotate(10deg) scale(0.5);
    opacity: 0;
  }
  100% {
    transform: translateY(0) rotate(-2deg) scale(1);
    opacity: 1;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .combo-display {
    right: 2%;
    top: 15%;
  }
  
  .combo-number {
    font-size: 3.5rem;
  }
  
  .combo-text {
    font-size: 1.8rem;
  }
  
  .combo-multiple {
    font-size: 1.4rem;
  }
}
</style>
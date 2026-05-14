<template>
  <header class="game-header">
    <div class="logo">
      <span class="logo-icon">🍇</span>
      <h1>🍎 水果消消乐 🍊</h1>
    </div>
    <div class="score-board">
      <div class="score-item">
        <span class="score-label">得分</span>
        <span class="score-value">{{ score }}</span>
      </div>
    </div>
    <div class="header-buttons">
      <button class="mute-btn" @click="handleMute">
        {{ isMuted ? '🔇' : '🔊' }}
      </button>
      <button class="reset-btn" @click="$emit('reset')">
        <span>🔄</span>
        重新开始
      </button>
      <button class="exit-btn" @click="$emit('exit')">
        <span>❌</span>
        退出游戏
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSoundEffects } from '../composables/useSoundEffects.js'

defineProps({
  score: {
    type: Number,
    default: 0
  }
})

defineEmits(['reset', 'exit'])

const { toggleMute, getMuted } = useSoundEffects()

const isMuted = ref(false)

const handleMute = () => {
  isMuted.value = toggleMute()
}

onMounted(() => {
  isMuted.value = getMuted()
})
</script>

<style scoped>
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
  --shadow-soft: rgba(255, 107, 157, 0.3);
  --shadow-glow: rgba(255, 107, 157, 0.5);
}

.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 32px;
  background: linear-gradient(145deg, var(--pearl-white) 0%, var(--candy-pink-light) 50%, var(--candy-pink) 100%);
  border-radius: 25px;
  border: 5px solid var(--candy-pink);
  box-shadow: 
    0 12px 40px var(--shadow-glow),
    inset 0 3px 6px rgba(255, 255, 255, 0.8),
    0 0 30px var(--shadow-soft);
  margin-bottom: 22px;
  position: relative;
  overflow: hidden;
}

.game-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 10px;
  background: linear-gradient(90deg, var(--mint-green) 0%, var(--sunny-yellow) 50%, var(--candy-pink) 100%);
  opacity: 0.95;
}

.logo {
  display: flex;
  align-items: center;
  gap: 18px;
}

.logo-icon {
  font-size: 3.2rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.35));
  animation: candyBounce 2.2s ease-in-out infinite;
}

@keyframes candyBounce {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-8px) rotate(3deg); }
}

.logo h1 {
  font-size: 2rem;
  font-weight: 900;
  color: var(--candy-pink);
  text-shadow: 
    0 2px 4px rgba(255, 107, 157, 0.3),
    0 0 15px rgba(255, 255, 255, 0.5);
  margin: 0;
  letter-spacing: 2px;
}

.score-board {
  display: flex;
  gap: 35px;
}

.score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.65);
  padding: 12px 30px;
  border-radius: 18px;
  border: 4px solid var(--mint-green);
  box-shadow: 
    0 6px 20px rgba(127, 219, 202, 0.35),
    inset 0 2px 4px rgba(255, 255, 255, 0.8);
}

.score-label {
  font-size: 0.95rem;
  color: var(--candy-purple);
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
}

.score-value {
  font-size: 2.6rem;
  font-weight: 900;
  color: var(--candy-pink);
  text-shadow: 
    0 3px 6px rgba(255, 107, 157, 0.4),
    0 0 15px rgba(255, 255, 255, 0.6);
}

.header-buttons {
  display: flex;
  gap: 15px;
}

.mute-btn {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--pearl-white) 0%, var(--candy-pink-light) 50%, var(--candy-pink) 100%);
  border: 4px solid var(--candy-pink);
  font-size: 1.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 6px 20px var(--shadow-glow),
    inset 0 3px 6px rgba(255, 255, 255, 0.8);
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.mute-btn:hover {
  transform: scale(1.12);
  box-shadow: 
    0 10px 30px var(--shadow-glow),
    inset 0 3px 6px rgba(255, 255, 255, 0.8),
    0 0 25px var(--shadow-soft);
}

.reset-btn,
.exit-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  border-radius: 22px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.2),
    inset 0 3px 6px rgba(255, 255, 255, 0.8);
}

.reset-btn {
  background: linear-gradient(145deg, #A8E6CF 0%, var(--mint-green) 50%, #6BC9B8 100%);
  border: 4px solid var(--mint-green);
  color: #2E7D32;
}

.exit-btn {
  background: linear-gradient(145deg, #FFE4EC 0%, var(--candy-pink-light) 50%, var(--candy-pink) 100%);
  border: 4px solid var(--candy-pink);
  color: #C2185B;
}

.reset-btn:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 
    0 12px 35px rgba(127, 219, 202, 0.5),
    inset 0 3px 6px rgba(255, 255, 255, 0.8);
}

.exit-btn:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 
    0 12px 35px var(--shadow-glow),
    inset 0 3px 6px rgba(255, 255, 255, 0.8);
}

.reset-btn span,
.exit-btn span {
  font-size: 1.4rem;
}

@media (max-width: 768px) {
  .game-header {
    flex-direction: column;
    gap: 18px;
    padding: 18px 22px;
  }
  
  .score-board {
    flex-direction: row;
    gap: 25px;
  }
  
  .header-buttons {
    flex-direction: row;
    gap: 12px;
  }
  
  .reset-btn,
  .exit-btn {
    padding: 12px 24px;
    font-size: 0.95rem;
  }
  
  .logo h1 {
    font-size: 1.7rem;
  }
  
  .logo-icon {
    font-size: 2.6rem;
  }
}

@media (max-width: 480px) {
  .game-header {
    padding: 14px 18px;
  }
  
  .logo {
    gap: 12px;
  }
  
  .logo h1 {
    font-size: 1.5rem;
  }
  
  .logo-icon {
    font-size: 2.2rem;
  }
  
  .score-value {
    font-size: 2rem;
  }
  
  .score-item {
    padding: 10px 20px;
  }
  
  .header-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .reset-btn,
  .exit-btn {
    width: 100%;
    justify-content: center;
  }
  
  .mute-btn {
    width: 50px;
    height: 50px;
    font-size: 1.4rem;
  }
}
</style>

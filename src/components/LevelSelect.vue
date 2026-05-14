<template>
  <div class="level-select-container">
    <!-- 天空背景 -->
    <div class="level-sky">
      <!-- 太阳 -->
      <div class="level-sun"></div>
      
      <!-- 云朵 -->
      <div class="level-cloud level-cloud-1"></div>
      <div class="level-cloud level-cloud-2"></div>
      
      <!-- 远山 -->
      <div class="level-mountains">
        <div class="level-mountain level-m-1"></div>
        <div class="level-mountain level-m-2"></div>
        <div class="level-mountain level-m-3"></div>
      </div>
      
      <!-- 飘落的叶子 -->
      <div class="level-falling-leaves">
        <div 
          v-for="i in 8" 
          :key="i" 
          class="level-falling-leaf"
          :style="{
            left: (Math.random() * 100) + '%',
            animationDuration: (8 + Math.random() * 12) + 's',
            animationDelay: (Math.random() * 5) + 's'
          }"
        ></div>
      </div>
    </div>
    
    <!-- 草地背景 -->
    <div class="level-grass">
      <!-- 草叶装饰 -->
      <div class="level-grass-blades">
        <div 
          v-for="i in 20" 
          :key="i" 
          class="level-blade"
          :style="{
            left: (i * 5) + '%',
            height: (20 + Math.random() * 20) + 'px',
            animationDelay: (Math.random() * 3) + 's'
          }"
        ></div>
      </div>
    </div>
    
    <!-- 标题 -->
    <div class="level-header">
      <h1 class="level-title">🍎 选择关卡 🍊</h1>
      <p class="level-subtitle">完成关卡解锁更多挑战！</p>
    </div>
    
    <!-- 返回按钮 -->
    <button class="back-btn" @click="$emit('back')">
      ← 返回主菜单
    </button>
    
    <!-- 静音按钮 -->
    <button class="mute-btn" @click="handleMute">
      {{ isMuted ? '🔇' : '🔊' }}
    </button>
    
    <!-- 关卡地图 -->
    <div class="level-map">
      <div class="level-scroll-container">
        <div class="level-track">
          <!-- 藤蔓连接线 -->
          <svg class="vine-line" viewBox="0 0 2300 100" preserveAspectRatio="none">
            <path
              d="M 0 50 Q 150 20 300 50 T 600 35 T 900 55 T 1200 30 T 1500 50 T 1800 40 T 2100 50"
              fill="none"
              stroke="#2E7D32"
              stroke-width="12"
              stroke-linecap="round"
              opacity="0.3"
            />
            <path
              d="M 0 50 Q 200 10 400 50 T 800 30 T 1200 60 T 1600 25 T 2000 55 T 2400 35 T 2800 50 T 3200 40 T 3400 50"
              fill="none"
              stroke="#4CAF50"
              stroke-width="6"
              stroke-linecap="round"
            />
            <!-- 路径上的叶子装饰 -->
            <ellipse cx="150" cy="30" rx="8" ry="5" fill="#66BB6A" transform="rotate(-30 150 30)" />
            <ellipse cx="550" cy="40" rx="7" ry="4" fill="#81C784" transform="rotate(20 550 40)" />
            <ellipse cx="950" cy="25" rx="8" ry="5" fill="#66BB6A" transform="rotate(-25 950 25)" />
            <ellipse cx="1350" cy="50" rx="7" ry="4" fill="#81C784" transform="rotate(30 1350 50)" />
            <ellipse cx="1750" cy="35" rx="8" ry="5" fill="#66BB6A" transform="rotate(-15 1750 35)" />
            <ellipse cx="2150" cy="45" rx="7" ry="4" fill="#81C784" transform="rotate(25 2150 45)" />
            <ellipse cx="2550" cy="30" rx="8" ry="5" fill="#66BB6A" transform="rotate(-20 2550 30)" />
            <ellipse cx="2950" cy="50" rx="7" ry="4" fill="#81C784" transform="rotate(15 2950 50)" />
          </svg>
          
          <!-- 关卡节点 -->
          <div 
            v-for="(level, index) in levels" 
            :key="level.id"
            class="level-node-wrapper"
            :style="{ left: getLevelPosition(index) + 'px' }"
          >
            <div
              class="level-node"
              :class="{
                'unlocked': isUnlocked(level.id),
                'locked': !isUnlocked(level.id),
                'completed': isCompleted(level.id)
              }"
              @click="selectLevel(level)"
            >
              <!-- 发光效果 -->
              <div class="level-glow"></div>
              
              <!-- 藤蔓环绕 -->
              <svg class="level-vine" viewBox="0 0 100 100">
                <path
                  d="M 10 10 Q 5 50 10 90 Q 50 95 90 90 Q 95 50 90 10 Q 50 5 10 10"
                  fill="none"
                  stroke="#4CAF50"
                  stroke-width="3"
                />
                <ellipse cx="20" cy="25" rx="6" ry="4" fill="#66BB6A" transform="rotate(-45 20 25)" />
                <ellipse cx="80" cy="25" rx="6" ry="4" fill="#81C784" transform="rotate(45 80 25)" />
                <ellipse cx="25" cy="75" rx="5" ry="3" fill="#66BB6A" transform="rotate(45 25 75)" />
                <ellipse cx="75" cy="75" rx="5" ry="3" fill="#81C784" transform="rotate(-45 75 75)" />
              </svg>
              
              <!-- 关卡按钮 -->
              <div class="level-button">
                <span class="level-number">{{ isCompleted(level.id) ? '✓' : level.id }}</span>
              </div>
              
              <!-- 小动物装饰 -->
              <div v-if="isUnlocked(level.id)" class="animal-decoration">
                <!-- 小兔子 -->
                <svg v-if="index === 0" viewBox="0 0 60 60">
                  <ellipse cx="30" cy="40" rx="18" ry="15" fill="#FFE4E1" />
                  <ellipse cx="22" cy="20" rx="5" ry="12" fill="#FFE4E1" />
                  <ellipse cx="38" cy="20" rx="5" ry="12" fill="#FFE4E1" />
                  <ellipse cx="22" cy="20" rx="2" ry="6" fill="#FFB6C1" />
                  <ellipse cx="38" cy="20" rx="2" ry="6" fill="#FFB6C1" />
                  <circle cx="26" cy="38" r="3" fill="#333" />
                  <circle cx="34" cy="38" r="3" fill="#333" />
                  <ellipse cx="30" cy="43" rx="3" ry="2" fill="#FFB6C1" />
                </svg>
                <!-- 小熊 -->
                <svg v-else-if="index === 1" viewBox="0 0 60 60">
                  <circle cx="30" cy="35" r="18" fill="#D2691E" />
                  <circle cx="18" cy="20" rx="8" ry="7" fill="#D2691E" />
                  <circle cx="42" cy="20" rx="8" ry="7" fill="#D2691E" />
                  <circle cx="18" cy="20" rx="4" ry="3" fill="#DEB887" />
                  <circle cx="42" cy="20" rx="4" ry="3" fill="#DEB887" />
                  <circle cx="25" cy="33" r="2" fill="#333" />
                  <circle cx="35" cy="33" r="2" fill="#333" />
                  <ellipse cx="30" cy="40" rx="4" ry="3" fill="#333" />
                  <ellipse cx="30" cy="44" rx="3" ry="2" fill="#FFB6C1" />
                </svg>
                <!-- 小鸟 -->
                <svg v-else-if="index === 2" viewBox="0 0 60 60">
                  <ellipse cx="30" cy="35" rx="15" ry="12" fill="#FFD700" />
                  <polygon points="15,35 30,20 30,35" fill="#FFD700" />
                  <ellipse cx="30" cy="20" rx="8" ry="6" fill="#FF8C00" />
                  <circle cx="26" cy="33" r="2" fill="#333" />
                  <circle cx="34" cy="33" r="2" fill="#333" />
                  <ellipse cx="30" cy="40" rx="2" ry="1.5" fill="#FF8C00" />
                </svg>
                <!-- 小猫 -->
                <svg v-else-if="index === 3" viewBox="0 0 60 60">
                  <ellipse cx="30" cy="38" rx="16" ry="14" fill="#FFA500" />
                  <polygon points="18,22 22,35 14,32" fill="#FFA500" />
                  <polygon points="42,22 38,35 46,32" fill="#FFA500" />
                  <polygon points="20,25 22,32 18,30" fill="#FFB6C1" />
                  <polygon points="40,25 38,32 42,30" fill="#FFB6C1" />
                  <circle cx="25" cy="36" r="2" fill="#333" />
                  <circle cx="35" cy="36" r="2" fill="#333" />
                  <ellipse cx="30" cy="42" rx="2" ry="1.5" fill="#FFB6C1" />
                </svg>
                <!-- 小狗 -->
                <svg v-else-if="index === 4" viewBox="0 0 60 60">
                  <ellipse cx="30" cy="38" rx="17" ry="15" fill="#D2B48C" />
                  <ellipse cx="22" cy="20" rx="6" ry="10" fill="#D2B48C" />
                  <ellipse cx="38" cy="20" rx="6" ry="10" fill="#D2B48C" />
                  <ellipse cx="22" cy="20" rx="3" ry="5" fill="#DEB887" />
                  <ellipse cx="38" cy="20" rx="3" ry="5" fill="#DEB887" />
                  <circle cx="26" cy="37" r="2" fill="#333" />
                  <circle cx="34" cy="37" r="2" fill="#333" />
                  <ellipse cx="30" cy="43" rx="3" ry="2" fill="#333" />
                  <path d="M 26 47 Q 30 52 34 47" fill="none" stroke="#333" stroke-width="2" />
                </svg>
                <!-- 狐狸 -->
                <svg v-else-if="index === 5" viewBox="0 0 60 60">
                  <ellipse cx="30" cy="38" rx="16" ry="14" fill="#FF7F50" />
                  <polygon points="18,22 24,36 14,34" fill="#FF7F50" />
                  <polygon points="42,22 36,36 46,34" fill="#FF7F50" />
                  <polygon points="20,25 24,32 18,31" fill="#FFF" />
                  <polygon points="40,25 36,32 42,31" fill="#FFF" />
                  <circle cx="25" cy="36" r="2" fill="#333" />
                  <circle cx="35" cy="36" r="2" fill="#333" />
                  <ellipse cx="30" cy="42" rx="2" ry="1.5" fill="#333" />
                </svg>
                <!-- 熊猫 -->
                <svg v-else-if="index === 6" viewBox="0 0 60 60">
                  <ellipse cx="30" cy="38" rx="17" ry="15" fill="#FFF" />
                  <circle cx="20" cy="28" rx="6" ry="8" fill="#333" />
                  <circle cx="40" cy="28" rx="6" ry="8" fill="#333" />
                  <circle cx="20" cy="28" rx="3" ry="4" fill="#FFF" />
                  <circle cx="40" cy="28" rx="3" ry="4" fill="#FFF" />
                  <circle cx="26" cy="37" r="2" fill="#333" />
                  <circle cx="34" cy="37" r="2" fill="#333" />
                  <ellipse cx="30" cy="43" rx="3" ry="2" fill="#333" />
                  <ellipse cx="30" cy="46" rx="2" ry="1.5" fill="#FFB6C1" />
                </svg>
                <!-- 小鹿 -->
                <svg v-else-if="index === 7" viewBox="0 0 60 60">
                  <ellipse cx="30" cy="38" rx="15" ry="13" fill="#DEB887" />
                  <polygon points="20,15 24,30 22,28" fill="#8B4513" />
                  <polygon points="40,15 36,30 38,28" fill="#8B4513" />
                  <circle cx="26" cy="36" r="2" fill="#333" />
                  <circle cx="34" cy="36" r="2" fill="#333" />
                  <ellipse cx="30" cy="42" rx="2" ry="1.5" fill="#333" />
                  <ellipse cx="22" cy="43" rx="3" ry="2" fill="#FFB6C1" />
                  <ellipse cx="38" cy="43" rx="3" ry="2" fill="#FFB6C1" />
                </svg>
                <!-- 猫头鹰 -->
                <svg v-else-if="index === 8" viewBox="0 0 60 60">
                  <ellipse cx="30" cy="38" rx="16" ry="15" fill="#8B7355" />
                  <ellipse cx="20" cy="35" rx="8" ry="10" fill="#FFEFD5" />
                  <ellipse cx="40" cy="35" rx="8" ry="10" fill="#FFEFD5" />
                  <circle cx="20" cy="35" r="5" fill="#333" />
                  <circle cx="40" cy="35" r="5" fill="#333" />
                  <circle cx="21" cy="34" r="2" fill="#FFF" />
                  <circle cx="41" cy="34" r="2" fill="#FFF" />
                  <polygon points="25,44 30,48 35,44" fill="#FFA500" />
                </svg>
                <!-- 松鼠 -->
                <svg v-else viewBox="0 0 60 60">
                  <ellipse cx="30" cy="38" rx="15" ry="13" fill="#D2691E" />
                  <ellipse cx="45" cy="30" rx="10" ry="8" fill="#D2691E" />
                  <ellipse cx="45" cy="30" rx="6" ry="5" fill="#DEB887" />
                  <circle cx="25" cy="36" r="2" fill="#333" />
                  <circle cx="33" cy="36" r="2" fill="#333" />
                  <ellipse cx="30" cy="42" rx="2" ry="1.5" fill="#333" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 飘落叶子装饰 -->
    <div class="level-leaves">
      <div class="level-leaf" v-for="n in 12" :key="n" :style="getLeafStyle(n)"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { LEVELS, getUnlockedLevels, isLevelUnlocked, unlockLevel } from '../constants/levels.js'
import { useSoundEffects } from '../composables/useSoundEffects.js'

const emit = defineEmits(['back', 'start-level'])
const { startBackgroundMusic, toggleMute, getMuted } = useSoundEffects()

const levels = ref(LEVELS)
const unlockedLevels = ref([])
const completedLevels = ref([])
const isMuted = ref(false)

const handleMute = () => {
  isMuted.value = toggleMute()
}

const getUnlocked = () => {
  unlockedLevels.value = getUnlockedLevels()
  const completed = localStorage.getItem('completedLevels')
  completedLevels.value = completed ? JSON.parse(completed) : []
}

const isUnlocked = (levelId) => {
  return unlockedLevels.value.includes(levelId)
}

const isCompleted = (levelId) => {
  return completedLevels.value.includes(levelId)
}

const getLevelPosition = (index) => {
  const positions = [50, 280, 510, 740, 970, 1200, 1430, 1660, 1890, 2120]
  return positions[index] || 50 + index * 230
}

const selectLevel = (level) => {
  if (isUnlocked(level.id)) {
    emit('start-level', level)
  }
}

const getLeafStyle = (n) => {
  const left = Math.random() * 100
  const delay = Math.random() * 8
  const duration = 8 + Math.random() * 8
  const size = 12 + Math.random() * 12
  const colors = ['#FF9800', '#FFC107', '#8BC34A', '#FF5722']
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: colors[n % colors.length]
  }
}

onMounted(() => {
  getUnlocked()
  startBackgroundMusic()
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

.level-select-container {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 糖果梦幻天空背景 */
.level-sky {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 75%;
  background: linear-gradient(180deg, 
    var(--lavender) 0%, 
    #F8E1F4 30%, 
    var(--light-pink) 60%, 
    #FFF0F5 100%);
}

/* 梦幻太阳 */
.level-sun {
  position: absolute;
  top: 5%;
  right: 10%;
  width: 90px;
  height: 90px;
  background: radial-gradient(circle, #FFE5EC 0%, var(--candy-pink) 50%, #FF9EBD 100%);
  border-radius: 50%;
  box-shadow: 
    0 0 40px var(--candy-pink),
    0 0 80px var(--shadow-glow),
    0 0 120px var(--shadow-soft);
  animation: candySunGlow 3s ease-in-out infinite;
}

@keyframes candySunGlow {
  0%, 100% { 
    box-shadow: 0 0 40px var(--candy-pink), 0 0 80px var(--shadow-glow), 0 0 120px var(--shadow-soft);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 60px var(--candy-pink), 0 0 100px var(--shadow-glow), 0 0 150px var(--shadow-soft);
    transform: scale(1.08);
  }
}

/* 梦幻云朵 */
.level-cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  opacity: 0.98;
  box-shadow: 0 8px 30px rgba(255, 182, 193, 0.4);
}

.level-cloud::before, .level-cloud::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 50%;
  box-shadow: 0 5px 20px rgba(255, 182, 193, 0.3);
}

.level-cloud-1 {
  width: 130px;
  height: 55px;
  top: 10%;
  left: 8%;
  animation: candyCloudFloat 22s ease-in-out infinite;
}

.level-cloud-1::before {
  width: 65px;
  height: 65px;
  top: -32px;
  left: 22px;
}

.level-cloud-1::after {
  width: 80px;
  height: 60px;
  top: -26px;
  left: 52px;
}

.level-cloud-2 {
  width: 110px;
  height: 48px;
  top: 18%;
  right: 15%;
  animation: candyCloudFloat 28s ease-in-out infinite reverse;
}

.level-cloud-2::before {
  width: 55px;
  height: 55px;
  top: -28px;
  left: 15px;
}

.level-cloud-2::after {
  width: 68px;
  height: 52px;
  top: -22px;
  left: 42px;
}

@keyframes candyCloudFloat {
  0%, 100% { transform: translateX(0) translateY(0); }
  25% { transform: translateX(25px) translateY(-12px); }
  50% { transform: translateX(50px) translateY(0); }
  75% { transform: translateX(25px) translateY(12px); }
}

/* 远山 */
.level-mountains {
  position: absolute;
  bottom: 25%;
  left: 0;
  width: 100%;
  height: 15%;
}

.level-mountain {
  position: absolute;
  bottom: 0;
  width: 0;
  height: 0;
  border-style: solid;
}

.level-m-1 {
  left: 5%;
  border-width: 0 80px 100px 80px;
  border-color: transparent transparent var(--candy-purple) transparent;
  opacity: 0.5;
}

.level-m-2 {
  left: 35%;
  border-width: 0 100px 130px 100px;
  border-color: transparent transparent var(--candy-pink) transparent;
  opacity: 0.4;
}

.level-m-3 {
  right: 8%;
  border-width: 0 90px 115px 90px;
  border-color: transparent transparent var(--mint-green) transparent;
  opacity: 0.45;
}

/* 糖果梦幻草地 */
.level-grass {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(180deg, 
    var(--mint-green) 0%, 
    #6BC9B8 40%, 
    #5BB8A8 100%);
  border-radius: 50% 50% 0 0 / 25% 25% 0 0;
  box-shadow: 
    inset 0 8px 30px rgba(255, 255, 255, 0.4),
    0 -5px 20px rgba(127, 219, 202, 0.3);
}

/* 草叶 */
.level-grass-blades {
  position: absolute;
  top: -12px;
  left: 0;
  width: 100%;
  height: 50px;
}

.level-blade {
  position: absolute;
  bottom: 0;
  width: 6px;
  background: linear-gradient(to top, var(--mint-green), #A8E6CF, #C8F0DC);
  border-radius: 50% 50% 0 0;
  animation: candyBladeSway 3.5s ease-in-out infinite;
  transform-origin: bottom center;
  box-shadow: 0 2px 8px rgba(127, 219, 202, 0.3);
}

@keyframes candyBladeSway {
  0%, 100% { transform: rotate(-6deg); }
  50% { transform: rotate(6deg); }
}

/* 飘落的叶子 */
.level-falling-leaves {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.level-falling-leaf {
  position: absolute;
  top: -20px;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, var(--candy-pink) 0%, var(--candy-pink-light) 100%);
  border-radius: 50% 0 50% 50%;
  animation: candyFall linear infinite;
  box-shadow: 0 4px 12px var(--shadow-soft);
}

.level-falling-leaf:nth-child(even) {
  background: linear-gradient(135deg, var(--mint-green) 0%, #A8E6CF 100%);
  box-shadow: 0 4px 12px rgba(127, 219, 202, 0.3);
}

.level-falling-leaf:nth-child(3n) {
  background: linear-gradient(135deg, var(--sunny-yellow) 0%, var(--gold) 100%);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

@keyframes candyFall {
  0% {
    transform: translateY(-20px) rotate(0deg) translateX(0);
    opacity: 0;
  }
  12% {
    opacity: 1;
  }
  88% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg) translateX(20px);
    opacity: 0;
  }
}

/* 标题 */
.level-header {
  text-align: center;
  margin-bottom: 30px;
  position: relative;
  z-index: 10;
  margin-top: 50px;
  animation: fadeInDown 1.2s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.level-title {
  font-size: 3rem;
  color: #fff;
  text-shadow: 
    3px 3px 6px rgba(0, 0, 0, 0.35),
    0 0 25px rgba(255, 107, 157, 0.6);
  margin: 0;
  font-weight: 900;
  letter-spacing: 3px;
}

.level-subtitle {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin: 12px 0 0 0;
}

/* 按钮 */
.back-btn {
  position: absolute;
  top: 22px;
  left: 22px;
  padding: 14px 28px;
  background: linear-gradient(145deg, var(--pearl-white) 0%, var(--candy-pink-light) 50%, var(--candy-pink) 100%);
  border: 4px solid var(--candy-pink);
  border-radius: 28px;
  font-size: 1.05rem;
  color: var(--candy-pink);
  font-weight: 700;
  cursor: pointer;
  box-shadow: 
    0 6px 25px var(--shadow-glow),
    inset 0 3px 6px rgba(255, 255, 255, 0.8);
  z-index: 20;
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.back-btn:hover {
  transform: scale(1.08);
  box-shadow: 
    0 10px 30px var(--shadow-glow),
    inset 0 3px 6px rgba(255, 255, 255, 0.8),
    0 0 25px var(--shadow-soft);
}

/* 静音按钮 */
.mute-btn {
  position: absolute;
  top: 22px;
  right: 22px;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--pearl-white) 0%, var(--candy-pink-light) 50%, var(--candy-pink) 100%);
  border: 4px solid var(--candy-pink);
  font-size: 1.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 6px 25px var(--shadow-glow),
    inset 0 3px 6px rgba(255, 255, 255, 0.8);
  z-index: 20;
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.mute-btn:hover {
  transform: scale(1.12);
  box-shadow: 
    0 10px 30px var(--shadow-glow),
    inset 0 3px 6px rgba(255, 255, 255, 0.8),
    0 0 25px var(--shadow-soft);
}

.level-map {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1400px;
  margin-top: 70px;
}

.level-scroll-container {
  width: 100%;
  height: 200px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 40px;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: var(--candy-pink) var(--pearl-white);
}

.level-scroll-container::-webkit-scrollbar {
  height: 12px;
}

.level-scroll-container::-webkit-scrollbar-track {
  background: var(--pearl-white);
  border-radius: 10px;
  margin: 0 50px;
}

.level-scroll-container::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, var(--candy-pink), var(--candy-pink-light));
  border-radius: 10px;
  border: 2px solid var(--pearl-white);
}

.level-scroll-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(90deg, var(--candy-pink-light), var(--candy-pink));
}

.level-scroll-container::-webkit-scrollbar-corner {
  background: transparent;
}

.level-track {
  position: relative;
  height: 170px;
  width: 2300px;
}

.vine-line {
  position: absolute;
  top: 70px;
  left: 0;
  width: 100%;
  height: 80px;
  z-index: 1;
}

.level-node-wrapper {
  position: absolute;
  top: 30px;
  width: 115px;
  height: 130px;
  z-index: 2;
  animation: fadeInUp 0.6s ease-out backwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.level-node {
  position: relative;
  width: 90px;
  height: 90px;
  margin: 0 auto;
  cursor: pointer;
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.level-node:hover {
  transform: scale(1.12);
}

.level-glow {
  position: absolute;
  top: -15px;
  left: -15px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 107, 157, 0.6) 0%, transparent 70%);
  opacity: 0;
  animation: pulseGlow 2.2s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.12); opacity: 0.6; }
}

.level-node.unlocked .level-glow {
  opacity: 0.5;
}

.level-vine {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  animation: vineSway 3.5s ease-in-out infinite;
}

@keyframes vineSway {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(1.2deg); }
}

.level-button {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--pearl-white) 0%, var(--lavender) 50%, var(--light-pink) 100%);
  border: 5px solid var(--candy-pink);
  box-shadow: 
    0 8px 30px var(--shadow-glow),
    inset 0 3px 6px rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.level-node.locked .level-button {
  background: linear-gradient(145deg, #B0BEC5 0%, #90A4AE 50%, #78909C 100%);
  border-color: #607D8B;
  cursor: not-allowed;
  box-shadow: 0 4px 15px rgba(96, 125, 139, 0.3);
}

.level-node.completed .level-button {
  background: linear-gradient(145deg, var(--mint-green) 0%, #6BC9B8 50%, #5BB8A8 100%);
  border-color: var(--mint-green);
  box-shadow: 
    0 8px 30px rgba(127, 219, 202, 0.5),
    inset 0 3px 6px rgba(255, 255, 255, 0.9);
}

.level-number {
  font-size: 34px;
  font-weight: 900;
  color: var(--candy-pink);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-shadow: 
    2px 2px 4px rgba(255, 107, 157, 0.3),
    0 0 10px rgba(255, 255, 255, 0.5);
}

.level-node.locked .level-number {
  color: #78909C;
  text-shadow: 2px 2px 4px rgba(120, 144, 156, 0.3);
}

.level-node.completed .level-number {
  color: #2E7D32;
  text-shadow: 
    2px 2px 4px rgba(46, 125, 50, 0.3),
    0 0 10px rgba(255, 255, 255, 0.5);
  font-size: 38px;
}

.animal-decoration {
  position: absolute;
  top: -38px;
  left: -18px;
  width: 50px;
  height: 50px;
  z-index: 4;
  animation: animalBounce 2.5s ease-in-out infinite;
}

@keyframes animalBounce {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-8px) rotate(3deg); }
}

.animal-decoration svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(3px 3px 5px rgba(0, 0, 0, 0.25));
}

.level-leaves {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 5;
}

.level-leaf {
  position: absolute;
  top: -25px;
  border-radius: 50% 0 50% 50%;
  animation: candyLeafFall linear infinite;
}

.level-leaf:nth-child(odd) {
  background: linear-gradient(135deg, var(--candy-pink) 0%, var(--candy-pink-light) 100%);
}

.level-leaf:nth-child(even) {
  background: linear-gradient(135deg, var(--mint-green) 0%, #A8E6CF 100%);
}

.level-leaf:nth-child(3n) {
  background: linear-gradient(135deg, var(--sunny-yellow) 0%, var(--gold) 100%);
}

@keyframes candyLeafFall {
  0% {
    transform: translateY(-25px) rotate(0deg) translateX(0);
    opacity: 0;
  }
  12% {
    opacity: 1;
  }
  88% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(800deg) translateX(25px);
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .level-title {
    font-size: 2.2rem;
  }
  
  .level-subtitle {
    font-size: 1.1rem;
  }
  
  .level-header {
    margin-top: 35px;
    margin-bottom: 25px;
  }
  
  .level-map {
    margin-top: 45px;
  }
  
  .level-button {
    width: 70px;
    height: 70px;
    border-width: 4px;
  }
  
  .level-number {
    font-size: 28px;
  }
  
  .level-node {
    width: 75px;
    height: 75px;
  }
  
  .level-vine {
    width: 75px;
    height: 75px;
  }
  
  .animal-decoration {
    width: 40px;
    height: 40px;
    top: -32px;
    left: -12px;
  }
  
  .back-btn {
    font-size: 0.95rem;
    padding: 10px 20px;
    top: 12px;
    left: 12px;
  }
  
  .level-track {
    height: 150px;
  }
  
  .level-node-wrapper {
    top: 22px;
    height: 110px;
  }
}

@media (max-width: 480px) {
  .level-title {
    font-size: 1.8rem;
  }
  
  .level-subtitle {
    font-size: 1rem;
  }
  
  .level-header {
    margin-top: 25px;
  }
  
  .level-map {
    margin-top: 35px;
    max-width: 100%;
  }
  
  .level-button {
    width: 60px;
    height: 60px;
    border-width: 3px;
  }
  
  .level-number {
    font-size: 24px;
  }
  
  .level-node {
    width: 65px;
    height: 65px;
  }
  
  .level-vine {
    width: 65px;
    height: 65px;
  }
  
  .animal-decoration {
    width: 35px;
    height: 35px;
    top: -28px;
    left: -10px;
  }
  
  .back-btn {
    font-size: 0.85rem;
    padding: 8px 15px;
  }
  
  .level-track {
    height: 130px;
  }
  
  .level-node-wrapper {
    top: 18px;
    height: 95px;
    width: 90px;
  }
  
  .level-scroll-container {
    padding-bottom: 30px;
  }
}

@media (max-width: 360px) {
  .level-title {
    font-size: 1.5rem;
  }
  
  .level-subtitle {
    font-size: 0.9rem;
  }
  
  .level-button {
    width: 52px;
    height: 52px;
  }
  
  .level-number {
    font-size: 22px;
  }
  
  .level-node {
    width: 56px;
    height: 56px;
  }
  
  .level-vine {
    width: 56px;
    height: 56px;
  }
  
  .animal-decoration {
    width: 30px;
    height: 30px;
    top: -24px;
    left: -8px;
  }
  
  .back-btn {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
}
</style>
<template>
  <div class="main-page">
    <!-- 背景层 -->
    <div class="background-layer">
      <!-- 天空渐变背景 -->
      <div class="sky">
        <!-- 太阳 -->
        <div class="sun">
          <div class="sun-rays"></div>
        </div>
      </div>
      
      <!-- 云朵 -->
      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
      <div class="cloud cloud-3"></div>
      
      <!-- 远山 -->
      <div class="mountains">
        <div class="mountain m-1"></div>
        <div class="mountain m-2"></div>
        <div class="mountain m-3"></div>
      </div>
      
      <!-- 草地 -->
      <div class="grass">
        <div class="grass-blades">
          <div class="blade" v-for="n in 20" :key="n" :style="getBladeStyle(n)"></div>
        </div>
      </div>
      
      <!-- 卡通大树 -->
      <div class="cartoon-tree">
        <!-- 树根 -->
        <div class="tree-roots">
          <div class="root root-1"></div>
          <div class="root root-2"></div>
          <div class="root root-3"></div>
          <div class="root root-4"></div>
        </div>
        
        <!-- 树干 -->
        <div class="cartoon-trunk">
          <div class="trunk-knot knot-1"></div>
          <div class="trunk-knot knot-2"></div>
          <div class="trunk-texture"></div>
        </div>
        
        <!-- 主树枝 -->
        <div class="main-branches">
          <div class="branch branch-1"></div>
          <div class="branch branch-2"></div>
          <div class="branch branch-3"></div>
          <div class="branch branch-4"></div>
        </div>
        
        <!-- 树冠 -->
        <div class="canopy">
          <div class="leaf-cluster cluster-1"></div>
          <div class="leaf-cluster cluster-2"></div>
          <div class="leaf-cluster cluster-3"></div>
          <div class="leaf-cluster cluster-4"></div>
          <div class="leaf-cluster cluster-5"></div>
          <div class="leaf-cluster cluster-6"></div>
          <div class="leaf-cluster cluster-7"></div>
          <div class="leaf-cluster cluster-8"></div>
          <div class="leaf-cluster cluster-9"></div>
        </div>
        
        <!-- 装饰树叶 -->
        <div class="small-leaves">
          <div class="small-leaf leaf-1"></div>
          <div class="small-leaf leaf-2"></div>
          <div class="small-leaf leaf-3"></div>
          <div class="small-leaf leaf-4"></div>
          <div class="small-leaf leaf-5"></div>
          <div class="small-leaf leaf-6"></div>
          <div class="small-leaf leaf-7"></div>
          <div class="small-leaf leaf-8"></div>
        </div>
        
        <!-- 树上水果 -->
        <div class="tree-fruits">
          <div class="fruit fruit-1">🍎</div>
          <div class="fruit fruit-2">🍊</div>
          <div class="fruit fruit-3">🍇</div>
          <div class="fruit fruit-4">🍓</div>
        </div>
      </div>
      
      <!-- 飘落的叶子 -->
      <div class="falling-leaves">
        <div 
          class="falling-leaf" 
          v-for="n in 15" 
          :key="n" 
          :style="getLeafStyle(n)"
        ></div>
      </div>
      
      <!-- 卡通动物 -->
      <div class="animals">
        <!-- 小兔子 -->
        <div class="rabbit">
          <div class="rabbit-ear ear-left"></div>
          <div class="rabbit-ear ear-right"></div>
          <div class="rabbit-head">
            <div class="rabbit-face">
              <div class="rabbit-eye eye-left"></div>
              <div class="rabbit-eye eye-right"></div>
              <div class="rabbit-nose"></div>
              <div class="rabbit-mouth"></div>
            </div>
          </div>
          <div class="rabbit-body">
            <div class="rabbit-paw paw-left"></div>
            <div class="rabbit-paw paw-right"></div>
          </div>
          <div class="rabbit-tail"></div>
        </div>
        
        <!-- 小熊 -->
        <div class="bear">
          <div class="bear-ear ear-left"></div>
          <div class="bear-ear ear-right"></div>
          <div class="bear-head">
            <div class="bear-face">
              <div class="bear-eye eye-left"></div>
              <div class="bear-eye eye-right"></div>
              <div class="bear-nose"></div>
              <div class="bear-mouth"></div>
            </div>
          </div>
          <div class="bear-body">
            <div class="bear-paw paw-left"></div>
            <div class="bear-paw paw-right"></div>
          </div>
        </div>
        
        <!-- 小鸟 -->
        <div class="bird">
          <div class="bird-body"></div>
          <div class="bird-wing wing-1"></div>
          <div class="bird-wing wing-2"></div>
          <div class="bird-head">
            <div class="bird-eye"></div>
            <div class="bird-beak"></div>
          </div>
          <div class="bird-tail"></div>
        </div>
        
        <!-- 蝴蝶 -->
        <div class="butterfly butterfly-1">
          <div class="butterfly-wing-left wing-top"></div>
          <div class="butterfly-wing-left wing-bot"></div>
          <div class="butterfly-wing-right wing-top"></div>
          <div class="butterfly-wing-right wing-bot"></div>
          <div class="butterfly-body"></div>
          <div class="butterfly-antenna antenna-1"></div>
          <div class="butterfly-antenna antenna-2"></div>
        </div>
        
        <div class="butterfly butterfly-2">
          <div class="butterfly-wing-left wing-top"></div>
          <div class="butterfly-wing-left wing-bot"></div>
          <div class="butterfly-wing-right wing-top"></div>
          <div class="butterfly-wing-right wing-bot"></div>
          <div class="butterfly-body"></div>
          <div class="butterfly-antenna antenna-1"></div>
          <div class="butterfly-antenna antenna-2"></div>
        </div>
      </div>
      
      <!-- 小花装饰 -->
      <div class="flowers">
        <div class="flower flower-1">
          <div class="flower-center"></div>
          <div class="flower-petal" v-for="n in 5" :key="n"></div>
        </div>
        <div class="flower flower-2">
          <div class="flower-center"></div>
          <div class="flower-petal" v-for="n in 5" :key="n"></div>
        </div>
        <div class="flower flower-3">
          <div class="flower-center"></div>
          <div class="flower-petal" v-for="n in 5" :key="n"></div>
        </div>
        <div class="flower flower-4">
          <div class="flower-center"></div>
          <div class="flower-petal" v-for="n in 5" :key="n"></div>
        </div>
        <div class="flower flower-5">
          <div class="flower-center"></div>
          <div class="flower-petal" v-for="n in 5" :key="n"></div>
        </div>
      </div>
    </div>
    
    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 静音按钮 -->
      <button class="mute-btn" @click="handleMute">
        <span class="mute-icon">{{ isMuted ? '🔇' : '🔊' }}</span>
      </button>
      
      <div class="game-collection-header">
        <div class="header-decoration">
          <span class="decor-star">*</span>
          <span class="decor-star">*</span>
        </div>
        <h1 class="collection-title">🎮 欢乐游戏乐园</h1>
        <p class="collection-subtitle">探索各种有趣的小游戏</p>
        <div class="header-decoration">
          <span class="decor-star">*</span>
          <span class="decor-star">*</span>
        </div>
      </div>
      
      <div class="game-card" @click="$emit('start-game')">
        <div class="card-glow"></div>
        <div class="game-icon">
          <span class="icon-emoji">🍇</span>
          <div class="icon-bounce"></div>
        </div>
        <div class="game-info">
          <h2 class="game-title">🍎 水果消消乐 🍊</h2>
          <p class="game-desc">匹配水果，收获快乐！</p>
          <div class="game-tags">
            <span class="tag">休闲</span>
            <span class="tag">益智</span>
            <span class="tag">消除</span>
          </div>
        </div>
        <div class="game-arrow">
          <span>></span>
        </div>
      </div>
      
      <div class="game-card balloon-card" @click="$emit('start-balloon-game')">
        <div class="card-glow balloon-glow"></div>
        <div class="game-icon">
          <span class="icon-emoji balloon-emoji">🎈</span>
          <div class="icon-bounce balloon-bounce"></div>
        </div>
        <div class="game-info">
          <h2 class="game-title">🎈 打气球游戏 🎈</h2>
          <p class="game-desc">瞄准气球，精准打击！</p>
          <div class="game-tags">
            <span class="tag">射击</span>
            <span class="tag">反应</span>
            <span class="tag">挑战</span>
          </div>
        </div>
        <div class="game-arrow">
          <span>></span>
        </div>
      </div>
      
      <div class="coming-soon">
        <div class="sparkles">**</div>
        <p>更多精彩游戏即将推出...</p>
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSoundEffects } from '../composables/useSoundEffects.js'

defineEmits(['start-game'])

const { startBackgroundMusic, toggleMute, getMuted } = useSoundEffects()

const isMuted = ref(false)

const handleMute = () => {
  isMuted.value = toggleMute()
}

onMounted(() => {
  startBackgroundMusic()
  isMuted.value = getMuted()
})

const getLeafStyle = (n) => {
  const left = Math.random() * 100
  const delay = Math.random() * 8
  const duration = 8 + Math.random() * 8
  const size = 12 + Math.random() * 12
  const colors = ['#FF9800', '#FFC107', '#8BC34A', '#FF5722', '#E65100', '#689F38']
  
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: colors[n % colors.length],
    '--rotation': `${Math.random() * 360}deg`
  }
}

const getBladeStyle = (n) => {
  const left = (n / 20) * 100
  const height = 20 + Math.random() * 30
  const delay = Math.random() * 2
  
  return {
    left: `${left}%`,
    height: `${height}px`,
    animationDelay: `${delay}s`
  }
}
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
  --candy-blue: #5DADE2;
  --shadow-soft: rgba(255, 107, 157, 0.3);
  --shadow-glow: rgba(255, 107, 157, 0.5);
}

.main-page {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.content-layer {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

/* 糖果梦幻天空背景 */
.sky {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 65%;
  background: linear-gradient(180deg, 
    var(--lavender) 0%, 
    #F8E1F4 30%, 
    var(--light-pink) 60%, 
    #FFF0F5 100%);
}

/* 梦幻太阳 */
.sun {
  position: absolute;
  top: 5%;
  right: 10%;
  width: 100px;
  height: 100px;
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

.sun-rays {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150px;
  height: 150px;
  transform: translate(-50%, -50%);
  animation: rotateRays 25s linear infinite;
}

@keyframes rotateRays {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.sun-rays::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 5px;
  height: 100%;
  background: linear-gradient(to bottom, transparent, rgba(255, 107, 157, 0.5), transparent);
  transform: translateX(-50%);
}

.sun-rays::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(to right, transparent, rgba(255, 107, 157, 0.5), transparent);
  transform: translateY(-50%);
}

/* 梦幻云朵 */
.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  opacity: 0.98;
  box-shadow: 0 8px 30px rgba(255, 182, 193, 0.4);
}

.cloud::before, .cloud::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 50%;
  box-shadow: 0 5px 20px rgba(255, 182, 193, 0.3);
}

.cloud-1 {
  width: 150px;
  height: 60px;
  top: 10%;
  left: 5%;
  animation: candyCloudFloat 22s ease-in-out infinite;
}

.cloud-1::before {
  width: 70px;
  height: 70px;
  top: -35px;
  left: 25px;
}

.cloud-1::after {
  width: 90px;
  height: 65px;
  top: -28px;
  left: 60px;
}

.cloud-2 {
  width: 130px;
  height: 50px;
  top: 18%;
  right: 8%;
  animation: candyCloudFloat 28s ease-in-out infinite reverse;
}

.cloud-2::before {
  width: 60px;
  height: 60px;
  top: -30px;
  left: 18px;
}

.cloud-2::after {
  width: 75px;
  height: 55px;
  top: -22px;
  left: 48px;
}

.cloud-3 {
  width: 110px;
  height: 45px;
  top: 25%;
  left: 35%;
  animation: candyCloudFloat 25s ease-in-out infinite;
  animation-delay: -8s;
}

.cloud-3::before {
  width: 55px;
  height: 55px;
  top: -28px;
  left: 12px;
}

.cloud-3::after {
  width: 68px;
  height: 50px;
  top: -22px;
  left: 42px;
}

@keyframes candyCloudFloat {
  0%, 100% { transform: translateX(0) translateY(0); }
  25% { transform: translateX(30px) translateY(-12px); }
  50% { transform: translateX(60px) translateY(0); }
  75% { transform: translateX(30px) translateY(12px); }
}

/* 糖果梦幻草地 */
.grass {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 45%;
  background: linear-gradient(180deg, 
    var(--mint-green) 0%, 
    #6BC9B8 40%, 
    #5BB8A8 100%);
  border-radius: 50% 50% 0 0 / 30% 30% 0 0;
  box-shadow: 
    inset 0 8px 30px rgba(255, 255, 255, 0.4),
    0 -5px 20px rgba(127, 219, 202, 0.3);
}

/* 草叶 */
.grass-blades {
  position: absolute;
  top: -18px;
  left: 0;
  width: 100%;
  height: 60px;
}

.blade {
  position: absolute;
  bottom: 0;
  width: 7px;
  background: linear-gradient(to top, var(--mint-green), #A8E6CF, #C8F0DC);
  border-radius: 50% 50% 0 0;
  animation: candyGrassSway 3.5s ease-in-out infinite;
  transform-origin: bottom center;
  box-shadow: 0 2px 8px rgba(127, 219, 202, 0.3);
}

@keyframes candyGrassSway {
  0%, 100% { transform: rotate(-8deg) scaleY(1); }
  50% { transform: rotate(8deg) scaleY(1.08); }
}

/* 卡通大树 */
.cartoon-tree {
  position: absolute;
  bottom: 18%;
  left: 50%;
  transform: translateX(-50%);
  width: 350px;
  height: 420px;
  z-index: 5;
}

/* 树根 */
.tree-roots {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  height: 45px;
}

.root {
  position: absolute;
  bottom: 0;
  background: linear-gradient(to bottom, var(--candy-pink-light), var(--candy-pink));
  border-radius: 50% 50% 0 0;
  box-shadow: 0 3px 10px var(--shadow-soft);
}

.root-1 {
  left: 12px;
  width: 35px;
  height: 40px;
  transform: rotate(-15deg);
}

.root-2 {
  left: 65px;
  width: 28px;
  height: 32px;
}

.root-3 {
  left: 120px;
  width: 30px;
  height: 36px;
}

.root-4 {
  left: 170px;
  width: 35px;
  height: 40px;
  transform: rotate(15deg);
}

/* 树干 */
.cartoon-trunk {
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  width: 90px;
  height: 160px;
  background: linear-gradient(90deg, var(--candy-pink-light) 0%, var(--pearl-white) 30%, var(--candy-pink) 70%, var(--candy-pink-light) 100%);
  border-radius: 12px 12px 0 0;
  position: relative;
  box-shadow: 
    0 8px 25px var(--shadow-soft),
    inset 0 2px 0 rgba(255, 255, 255, 0.6);
}

.trunk-knot {
  position: absolute;
  background: var(--candy-pink);
  border-radius: 50%;
}

.knot-1 {
  top: 35px;
  left: 18px;
  width: 18px;
  height: 18px;
}

.knot-2 {
  top: 90px;
  right: 15px;
  width: 15px;
  height: 15px;
}

.trunk-texture {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 3px,
    rgba(255, 107, 157, 0.15) 3px,
    rgba(255, 107, 157, 0.15) 6px
  );
  border-radius: 12px 12px 0 0;
}

/* 主树枝 */
.main-branches {
  position: absolute;
  bottom: 155px;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  height: 90px;
}

.branch {
  position: absolute;
  background: linear-gradient(to right, var(--candy-pink), var(--candy-pink-light));
  border-radius: 50%;
  box-shadow: 0 3px 10px var(--shadow-soft);
}

.branch-1 {
  bottom: 0;
  left: 22px;
  width: 110px;
  height: 18px;
  transform: rotate(-22deg);
  transform-origin: right center;
}

.branch-2 {
  bottom: 0;
  right: 22px;
  width: 110px;
  height: 18px;
  transform: rotate(22deg);
  transform-origin: left center;
}

.branch-3 {
  bottom: 35px;
  left: 50%;
  transform: translateX(-50%);
  width: 90px;
  height: 15px;
}

.branch-4 {
  bottom: 58px;
  left: 50%;
  transform: translateX(-50%) rotate(180deg);
  width: 70px;
  height: 12px;
}

/* 树冠 */
.canopy {
  position: absolute;
  bottom: 200px;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  height: 220px;
}

.leaf-cluster {
  position: absolute;
  border-radius: 50%;
}

.cluster-1 {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 130px;
  height: 110px;
  background: linear-gradient(135deg, var(--candy-pink-light), var(--candy-pink));
  box-shadow: 
    inset -12px -12px 25px rgba(255, 107, 157, 0.3),
    0 8px 25px var(--shadow-soft);
}

.cluster-2 {
  bottom: 75px;
  left: 12px;
  width: 100px;
  height: 90px;
  background: linear-gradient(135deg, var(--candy-pink), var(--candy-pink-light));
  box-shadow: 
    inset -10px -10px 20px rgba(255, 107, 157, 0.25),
    0 6px 20px var(--shadow-soft);
}

.cluster-3 {
  bottom: 75px;
  right: 12px;
  width: 100px;
  height: 90px;
  background: linear-gradient(135deg, var(--candy-pink), var(--candy-pink-light));
  box-shadow: 
    inset -10px -10px 20px rgba(255, 107, 157, 0.25),
    0 6px 20px var(--shadow-soft);
}

.cluster-4 {
  bottom: 145px;
  left: 32px;
  width: 90px;
  height: 80px;
  background: linear-gradient(135deg, var(--mint-green), var(--candy-pink-light));
  box-shadow: 
    inset -8px -8px 15px rgba(127, 219, 202, 0.3),
    0 5px 15px rgba(127, 219, 202, 0.3);
}

.cluster-5 {
  bottom: 145px;
  right: 32px;
  width: 90px;
  height: 80px;
  background: linear-gradient(135deg, var(--mint-green), var(--candy-pink-light));
  box-shadow: 
    inset -8px -8px 15px rgba(127, 219, 202, 0.3),
    0 5px 15px rgba(127, 219, 202, 0.3);
}

.cluster-6 {
  bottom: 190px;
  left: 68px;
  width: 72px;
  height: 62px;
  background: linear-gradient(135deg, var(--mint-green), #A8E6CF);
  box-shadow: 
    inset -6px -6px 12px rgba(127, 219, 202, 0.3),
    0 4px 12px rgba(127, 219, 202, 0.25);
}

.cluster-7 {
  bottom: 190px;
  right: 68px;
  width: 72px;
  height: 62px;
  background: linear-gradient(135deg, var(--mint-green), #A8E6CF);
  box-shadow: 
    inset -6px -6px 12px rgba(127, 219, 202, 0.3),
    0 4px 12px rgba(127, 219, 202, 0.25);
}

.cluster-8 {
  bottom: 210px;
  left: 50%;
  transform: translateX(-50%);
  width: 62px;
  height: 52px;
  background: linear-gradient(135deg, #A8E6CF, var(--mint-green));
  box-shadow: 
    inset -5px -5px 10px rgba(127, 219, 202, 0.3),
    0 4px 10px rgba(127, 219, 202, 0.2);
}

.cluster-9 {
  bottom: 165px;
  left: 50%;
  transform: translateX(-50%);
  width: 85px;
  height: 72px;
  background: linear-gradient(135deg, var(--mint-green), var(--candy-pink-light));
  box-shadow: 
    inset -6px -6px 12px rgba(127, 219, 202, 0.25),
    0 5px 12px rgba(127, 219, 202, 0.25);
}

/* 小树叶装饰 */
.small-leaves {
  position: absolute;
  bottom: 175px;
  left: 50%;
  transform: translateX(-50%);
  width: 340px;
  height: 240px;
}

.small-leaf {
  position: absolute;
  width: 22px;
  height: 22px;
  background: linear-gradient(135deg, var(--mint-green), #A8E6CF);
  border-radius: 50% 0 50% 50%;
  animation: candyLeafSway 4.5s ease-in-out infinite;
  box-shadow: 0 3px 8px rgba(127, 219, 202, 0.3);
}

.small-leaf:nth-child(odd) {
  background: linear-gradient(135deg, var(--candy-pink-light), var(--candy-pink));
  box-shadow: 0 3px 8px var(--shadow-soft);
}

.leaf-1 {
  top: 22px;
  left: 22px;
  transform: rotate(-30deg);
  animation-delay: 0s;
}

.leaf-2 {
  top: 45px;
  right: 35px;
  transform: rotate(45deg);
  animation-delay: 0.6s;
}

.leaf-3 {
  top: 90px;
  left: 12px;
  transform: rotate(15deg);
  animation-delay: 1.2s;
}

.leaf-4 {
  top: 112px;
  right: 18px;
  transform: rotate(-20deg);
  animation-delay: 1.8s;
}

.leaf-5 {
  top: 158px;
  left: 45px;
  transform: rotate(30deg);
  animation-delay: 2.4s;
}

.leaf-6 {
  top: 178px;
  right: 55px;
  transform: rotate(-45deg);
  animation-delay: 3s;
}

.leaf-7 {
  top: 68px;
  left: 50%;
  transform: translateX(-50%) rotate(0deg);
  animation-delay: 0.9s;
}

.leaf-8 {
  top: 135px;
  left: 50%;
  transform: translateX(-50%) rotate(180deg);
  animation-delay: 2.1s;
}

@keyframes candyLeafSway {
  0%, 100% { transform: rotate(var(--rotation, 0deg)) translateX(0); }
  50% { transform: rotate(calc(var(--rotation, 0deg) + 12deg)) translateX(6px); }
}

/* 树上水果 */
.tree-fruits {
  position: absolute;
  bottom: 190px;
  left: 50%;
  transform: translateX(-50%);
  width: 310px;
  height: 200px;
}

.fruit {
  position: absolute;
  font-size: 3rem;
  animation: fruitBounce 3.5s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.fruit-1 {
  top: 35px;
  left: 35px;
  animation-delay: 0s;
}

.fruit-2 {
  top: 58px;
  right: 45px;
  animation-delay: 0.6s;
}

.fruit-3 {
  top: 112px;
  left: 55px;
  animation-delay: 1.2s;
}

.fruit-4 {
  top: 135px;
  right: 68px;
  animation-delay: 1.8s;
}

@keyframes fruitBounce {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-10px) rotate(3deg); }
}

/* 飘落的叶子 */
.falling-leaves {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 4;
}

.falling-leaf {
  position: absolute;
  top: -25px;
  border-radius: 50% 0 50% 50%;
  animation: candyLeafFall linear infinite;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.falling-leaf:nth-child(odd) {
  background: linear-gradient(135deg, var(--candy-pink) 0%, var(--candy-pink-light) 100%);
}

.falling-leaf:nth-child(even) {
  background: linear-gradient(135deg, var(--mint-green) 0%, #A8E6CF 100%);
}

.falling-leaf:nth-child(3n) {
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
    transform: translateY(100vh) rotate(800deg) translateX(30px);
    opacity: 0;
  }
}

/* 卡通动物 */
.animals {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 6;
}

/* 小兔子 */
.rabbit {
  position: absolute;
  bottom: 13%;
  left: 5%;
  width: 85px;
  height: 105px;
  animation: rabbitHop 2.8s ease-in-out infinite;
}

@keyframes rabbitHop {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-18px); }
}

.rabbit-ear {
  position: absolute;
  width: 16px;
  height: 45px;
  background: linear-gradient(to bottom, var(--candy-pink-light), var(--candy-pink));
  border-radius: 50% 50% 0 0;
  box-shadow: 0 3px 10px var(--shadow-soft);
}

.ear-left {
  top: 0;
  left: 16px;
  transform: rotate(-12deg);
}

.ear-right {
  top: 0;
  right: 16px;
  transform: rotate(12deg);
}

.rabbit-head {
  position: absolute;
  top: 38px;
  left: 50%;
  transform: translateX(-50%);
  width: 55px;
  height: 45px;
  background: linear-gradient(135deg, var(--candy-pink-light), var(--candy-pink));
  border-radius: 50%;
  box-shadow: 0 4px 12px var(--shadow-soft);
}

.rabbit-face {
  position: relative;
  width: 100%;
  height: 100%;
}

.rabbit-eye {
  position: absolute;
  top: 14px;
  width: 9px;
  height: 9px;
  background: linear-gradient(135deg, #333, #555);
  border-radius: 50%;
}

.eye-left {
  left: 12px;
}

.eye-right {
  right: 12px;
}

.rabbit-nose {
  position: absolute;
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
  width: 7px;
  height: 5px;
  background: var(--candy-pink);
  border-radius: 50%;
}

.rabbit-mouth {
  position: absolute;
  top: 36px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 5px;
  border-bottom: 2.5px solid #333;
  border-radius: 0 0 50% 50%;
}

.rabbit-body {
  position: absolute;
  top: 78px;
  left: 50%;
  transform: translateX(-50%);
  width: 45px;
  height: 28px;
  background: linear-gradient(135deg, var(--candy-pink-light), var(--candy-pink));
  border-radius: 50%;
  box-shadow: 0 3px 10px var(--shadow-soft);
}

.rabbit-paw {
  position: absolute;
  bottom: 0;
  width: 14px;
  height: 12px;
  background: linear-gradient(135deg, var(--candy-pink-light), var(--candy-pink));
  border-radius: 50%;
  box-shadow: 0 2px 6px var(--shadow-soft);
}

.paw-left {
  left: 6px;
}

.paw-right {
  right: 6px;
}

.rabbit-tail {
  position: absolute;
  top: 95px;
  right: 6px;
  width: 17px;
  height: 17px;
  background: linear-gradient(135deg, var(--candy-pink-light), var(--candy-pink));
  border-radius: 50%;
  box-shadow: 0 3px 8px var(--shadow-soft);
}

/* 小熊 */
.bear {
  position: absolute;
  bottom: 11%;
  right: 8%;
  width: 105px;
  height: 118px;
  animation: bearWave 3.2s ease-in-out infinite;
}

@keyframes bearWave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(3.5deg); }
  75% { transform: rotate(-3.5deg); }
}

.bear-ear {
  position: absolute;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, var(--candy-pink), var(--candy-pink-light));
  border-radius: 50%;
  box-shadow: 0 3px 10px var(--shadow-soft);
}

.bear-ear.ear-left {
  top: 6px;
  left: 12px;
}

.bear-ear.ear-right {
  top: 6px;
  right: 12px;
}

.bear-head {
  position: absolute;
  top: 22px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 60px;
  background: linear-gradient(135deg, var(--candy-pink), var(--candy-pink-light));
  border-radius: 50%;
  box-shadow: 0 4px 15px var(--shadow-soft);
}

.bear-face {
  position: relative;
  width: 100%;
  height: 100%;
}

.bear-eye {
  position: absolute;
  top: 18px;
  width: 9px;
  height: 9px;
  background: linear-gradient(135deg, #333, #555);
  border-radius: 50%;
}

.bear-eye.eye-left {
  left: 18px;
}

.bear-eye.eye-right {
  right: 18px;
}

.bear-nose {
  position: absolute;
  top: 35px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 12px;
  background: linear-gradient(135deg, #333, #555);
  border-radius: 50%;
}

.bear-mouth {
  position: absolute;
  top: 48px;
  left: 50%;
  transform: translateX(-50%);
  width: 22px;
  height: 10px;
  border-bottom: 3px solid #333;
  border-radius: 0 0 50% 50%;
}

.bear-body {
  position: absolute;
  top: 78px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 38px;
  background: linear-gradient(135deg, var(--candy-pink), var(--candy-pink-light));
  border-radius: 50%;
  box-shadow: 0 4px 12px var(--shadow-soft);
}

.bear-paw {
  position: absolute;
  bottom: 6px;
  width: 20px;
  height: 17px;
  background: var(--pearl-white);
  border-radius: 50%;
  box-shadow: 0 2px 6px var(--shadow-soft);
}

.bear-paw.paw-left {
  left: 6px;
  animation: pawWave 0.6s ease-in-out infinite;
}

.bear-paw.paw-right {
  right: 6px;
}

@keyframes pawWave {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-25deg); }
}

/* 小鸟 */
.bird {
  position: absolute;
  top: 26%;
  left: 15%;
  width: 55px;
  height: 45px;
  animation: birdFly 4.5s ease-in-out infinite;
}

@keyframes birdFly {
  0%, 100% { transform: translateX(0) translateY(0); }
  25% { transform: translateX(25px) translateY(-12px); }
  50% { transform: translateX(50px) translateY(0); }
  75% { transform: translateX(25px) translateY(12px); }
}

.bird-body {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 28px;
  height: 22px;
  background: linear-gradient(135deg, var(--candy-pink), var(--candy-pink-light));
  border-radius: 50%;
  box-shadow: 0 3px 10px var(--shadow-soft);
}

.bird-wing {
  position: absolute;
  top: 14px;
  left: 22px;
  width: 20px;
  height: 9px;
  background: linear-gradient(135deg, var(--candy-pink), var(--candy-pink-light));
  border-radius: 50%;
  transform-origin: left center;
}

.wing-1 {
  animation: wingFlap 0.35s ease-in-out infinite;
}

.wing-2 {
  animation: wingFlap 0.35s ease-in-out infinite 0.17s;
}

@keyframes wingFlap {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-50deg); }
}

.bird-head {
  position: absolute;
  top: 6px;
  left: 35px;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, var(--candy-pink), var(--candy-pink-light));
  border-radius: 50%;
  box-shadow: 0 2px 6px var(--shadow-soft);
}

.bird-eye {
  position: absolute;
  top: 5px;
  right: 4px;
  width: 5px;
  height: 5px;
  background: #333;
  border-radius: 50%;
}

.bird-beak {
  position: absolute;
  top: 8px;
  right: -6px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px 0 5px 10px;
  border-color: transparent transparent transparent var(--sunny-yellow);
}

.bird-tail {
  position: absolute;
  top: 18px;
  left: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 7px 14px 7px 0;
  border-color: transparent var(--candy-pink) transparent transparent;
}

/* 蝴蝶 */
.butterfly {
  position: absolute;
  width: 42px;
  height: 38px;
}

.butterfly-1 {
  top: 31%;
  right: 20%;
  animation: butterflyFloat 5.5s ease-in-out infinite;
}

.butterfly-2 {
  top: 42%;
  left: 25%;
  animation: butterflyFloat 6.5s ease-in-out infinite;
  animation-delay: -2.5s;
}

@keyframes butterflyFloat {
  0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
  25% { transform: translateX(18px) translateY(-12px) rotate(6deg); }
  50% { transform: translateX(36px) translateY(0) rotate(0deg); }
  75% { transform: translateX(18px) translateY(12px) rotate(-6deg); }
}

.butterfly-wing-left,
.butterfly-wing-right {
  position: absolute;
}

.wing-top {
  width: 19px;
  height: 17px;
  border-radius: 50%;
}

.wing-bot {
  width: 15px;
  height: 13px;
  border-radius: 50%;
  top: 15px;
}

.butterfly-wing-left .wing-top {
  left: 0;
  background: linear-gradient(135deg, var(--candy-pink), var(--candy-pink-light));
  box-shadow: 0 2px 8px var(--shadow-soft);
}

.butterfly-wing-left .wing-bot {
  left: 2px;
  background: linear-gradient(135deg, var(--candy-pink-light), #FFE4EC);
  box-shadow: 0 2px 6px var(--shadow-soft);
}

.butterfly-wing-right .wing-top {
  right: 0;
  background: linear-gradient(135deg, var(--candy-purple), var(--candy-pink-light));
  box-shadow: 0 2px 8px var(--shadow-glow);
}

.butterfly-wing-right .wing-bot {
  right: 2px;
  background: linear-gradient(135deg, var(--candy-pink-light), #FFE4EC);
  box-shadow: 0 2px 6px var(--shadow-soft);
}

.butterfly-body {
  position: absolute;
  top: 9px;
  left: 50%;
  transform: translateX(-50%);
  width: 5px;
  height: 22px;
  background: linear-gradient(to bottom, #333, #666);
  border-radius: 2.5px;
}

.butterfly-antenna {
  position: absolute;
  top: 3px;
  width: 2.5px;
  height: 11px;
  background: #333;
}

.antenna-1 {
  left: calc(50% - 9px);
  transform: rotate(-22deg);
}

.antenna-2 {
  right: calc(50% - 9px);
  transform: rotate(22deg);
}

.antenna-1::after,
.antenna-2::after {
  content: '';
  position: absolute;
  top: 0;
  width: 5px;
  height: 5px;
  background: #333;
  border-radius: 50%;
}

/* 小花 */
.flowers {
  position: absolute;
  bottom: 9%;
  left: 0;
  width: 100%;
  height: 65px;
}

.flower {
  position: absolute;
  width: 42px;
  height: 42px;
}

.flower-1 {
  left: 15%;
}

.flower-2 {
  left: 45%;
}

.flower-3 {
  left: 75%;
}

.flower-4 {
  left: 25%;
}

.flower-5 {
  left: 65%;
}

.flower-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  background: linear-gradient(135deg, var(--sunny-yellow), var(--gold));
  border-radius: 50%;
  z-index: 2;
  box-shadow: 0 2px 6px rgba(255, 215, 0, 0.3);
}

.flower-petal {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 13px;
  height: 20px;
  background: linear-gradient(135deg, var(--candy-pink-light), var(--candy-pink));
  border-radius: 50%;
  transform-origin: bottom center;
  box-shadow: 0 3px 8px var(--shadow-soft);
}

.flower-petal:nth-child(2) { transform: translate(-50%, -100%) rotate(0deg); }
.flower-petal:nth-child(3) { transform: translate(-50%, -100%) rotate(72deg); }
.flower-petal:nth-child(4) { transform: translate(-50%, -100%) rotate(144deg); }
.flower-petal:nth-child(5) { transform: translate(-50%, -100%) rotate(216deg); }
.flower-petal:nth-child(6) { transform: translate(-50%, -100%) rotate(288deg); }

/* 内容层 */
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
    0 8px 30px var(--shadow-glow),
    inset 0 3px 6px rgba(255, 255, 255, 0.8),
    0 0 25px var(--shadow-soft);
}

.mute-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.game-collection-header {
  text-align: center;
  margin-bottom: 45px;
  animation: fadeInDown 1.2s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-35px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-decoration {
  display: flex;
  justify-content: center;
  gap: 18px;
  margin-bottom: 12px;
}

.decor-star {
  font-size: 1.8rem;
  color: var(--gold);
  text-shadow: 0 0 12px rgba(255, 215, 0, 0.9);
  animation: starTwinkle 2.2s ease-in-out infinite;
}

@keyframes starTwinkle {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.25); }
}

.collection-title {
  font-size: 3.2rem;
  color: #fff;
  text-shadow: 
    3px 3px 6px rgba(0, 0, 0, 0.35),
    0 0 25px rgba(255, 107, 157, 0.6);
  margin: 0;
  font-weight: 900;
  letter-spacing: 3px;
}

.collection-subtitle {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* 游戏卡片 */
.game-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 35px 45px;
  background: linear-gradient(145deg, var(--pearl-white) 0%, var(--lavender) 50%, var(--light-pink) 100%);
  border-radius: 28px;
  border: 5px solid var(--candy-pink);
  box-shadow: 
    0 18px 50px var(--shadow-glow),
    inset 0 3px 6px rgba(255, 255, 255, 0.8),
    0 0 30px var(--shadow-soft);
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  max-width: 550px;
  width: 90%;
}

.game-card:hover {
  transform: translateY(-10px) scale(1.03);
  box-shadow: 
    0 28px 60px var(--shadow-glow),
    inset 0 3px 6px rgba(255, 255, 255, 0.8),
    0 0 40px var(--shadow-soft);
}

.card-glow {
  position: absolute;
  top: -55%;
  left: -55%;
  right: -55%;
  bottom: -55%;
  background: radial-gradient(circle, rgba(255, 107, 157, 0.2) 0%, transparent 70%);
  pointer-events: none;
  animation: glowPulse 2.2s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.game-icon {
  position: relative;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-emoji {
  font-size: 4rem;
  filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.35));
  animation: iconBounce 2.2s ease-in-out infinite;
}

@keyframes iconBounce {
  0%, 100% { transform: translateY(0) rotate(-6deg); }
  50% { transform: translateY(-10px) rotate(6deg); }
}

.icon-bounce {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 115px;
  height: 115px;
  background: radial-gradient(circle, rgba(255, 107, 157, 0.5) 0%, transparent 70%);
  animation: bounceWave 2.2s ease-in-out infinite;
}

@keyframes bounceWave {
  0%, 100% { transform: translate(-50%, -50%) scale(0.85); opacity: 0.5; }
  50% { transform: translate(-50%, -50%) scale(1.25); opacity: 0; }
}

.game-info {
  flex: 1;
}

.game-title {
  font-size: 1.8rem;
  color: var(--candy-pink);
  margin: 0 0 10px 0;
  font-weight: 900;
  text-shadow: 2px 2px 4px rgba(255, 107, 157, 0.3);
}

.game-desc {
  font-size: 1.1rem;
  color: var(--candy-purple);
  margin: 0 0 15px 0;
}

.game-tags {
  display: flex;
  gap: 12px;
}

.tag {
  padding: 6px 18px;
  background: linear-gradient(145deg, var(--mint-green) 0%, #6BC9B8 100%);
  border-radius: 22px;
  font-size: 0.9rem;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 3px 12px rgba(127, 219, 202, 0.4);
}

.game-arrow {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, var(--candy-pink) 0%, var(--candy-pink-light) 100%);
  border-radius: 50%;
  color: #fff;
  font-size: 1.7rem;
  font-weight: bold;
  box-shadow: 0 5px 18px var(--shadow-glow);
  animation: arrowPulse 1.7s ease-in-out infinite;
}

@keyframes arrowPulse {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(7px); }
}

/* 即将推出 */
.coming-soon {
  margin-top: 55px;
  text-align: center;
  padding: 28px 45px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 22px;
  border: 2px dashed rgba(255, 107, 157, 0.5);
  backdrop-filter: blur(8px);
  animation: fadeInUp 1.2s ease-out 0.6s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(35px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sparkles {
  font-size: 2.2rem;
  margin-bottom: 12px;
  animation: sparkle 1.7s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.coming-soon p {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.35);
  margin: 0 0 18px 0;
}

.progress-bar {
  width: 220px;
  height: 10px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 5px;
  overflow: hidden;
  margin: 0 auto;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--candy-pink) 0%, var(--candy-pink-light) 50%, var(--candy-pink) 100%);
  border-radius: 5px;
  animation: progressMove 3.5s ease-in-out infinite;
  box-shadow: 0 2px 6px var(--shadow-soft);
}

@keyframes progressMove {
  0%, 100% { width: 22%; }
  50% { width: 62%; }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cartoon-tree {
    width: 250px;
    height: 320px;
  }
  
  .collection-title {
    font-size: 2.2rem;
  }
  
  .game-card {
    padding: 25px 30px;
    gap: 20px;
  }
  
  .game-title {
    font-size: 1.4rem;
  }
  
  .sun {
    width: 70px;
    height: 70px;
    top: 6%;
    right: 8%;
  }
  
  .mute-btn {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
  
  .bird {
    left: 10%;
  }
}

@media (max-width: 480px) {
  .cartoon-tree {
    width: 220px;
    height: 280px;
    bottom: 15%;
  }
  
  .collection-title {
    font-size: 1.8rem;
  }
  
  .collection-subtitle {
    font-size: 1rem;
  }
  
  .game-card {
    padding: 20px 25px;
    gap: 15px;
  }
  
  .game-icon {
    width: 60px;
    height: 60px;
  }
  
  .icon-emoji {
    font-size: 2.5rem;
  }
  
  .game-title {
    font-size: 1.2rem;
  }
  
  .game-desc {
    font-size: 0.9rem;
  }
  
  .tag {
    padding: 4px 12px;
    font-size: 0.75rem;
  }
  
  .game-arrow {
    width: 35px;
    height: 35px;
    font-size: 1.3rem;
  }
  
  .sun {
    width: 55px;
    height: 55px;
    top: 8%;
    right: 5%;
  }
  
  .mute-btn {
    width: 45px;
    height: 45px;
    font-size: 1.3rem;
  }
  
  .rabbit {
    width: 65px;
    height: 80px;
    left: 3%;
  }
  
  .bear {
    width: 80px;
    height: 90px;
    right: 5%;
  }
  
  .bird {
    left: 5%;
    transform: scale(0.8);
  }
}
</style>
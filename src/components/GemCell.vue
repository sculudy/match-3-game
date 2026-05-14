<template>
  <div
    class="gem-cell"
    :class="{
      'is-selected': isSelected,
      'is-matched': isMatched,
      'is-new': gem?.isNew,
      'is-falling': gem?.isFalling,
      'is-swiping': isSwiping,
      'is-empty': !gem && !obstacle,
      'is-hint': isHint && showHint,
      'is-power-row': gem?.powerType === 'row',
      'is-power-col': gem?.powerType === 'col',
      'is-power-wrap': gem?.powerType === 'wrap',
      'is-power-rainbow': gem?.powerType === 'rainbow',
      'has-obstacle-ice': obstacle?.type === 'ice',
      'has-obstacle-ice2': obstacle?.type === 'ice2',
      'has-obstacle-chain': obstacle?.type === 'chain',
      'has-obstacle-block': obstacle?.type === 'block',
      'swipe-up': swipeDirection === 'up',
      'swipe-down': swipeDirection === 'down',
      'swipe-left': swipeDirection === 'left',
      'swipe-right': swipeDirection === 'right'
    }"
    :style="gemStyle"
    @click="handleClick"
    @touchstart.prevent="handleTouchStart"
    @touchmove.prevent="handleTouchMove"
    @touchend="handleTouchEnd"
    @touchcancel="handleTouchCancel"
    @mousedown="handleMouseDown"
  >
    <span class="gem-emoji" v-if="gem">{{ gemEmoji }}</span>
    
    <!-- 障碍层 -->
    <div class="obstacle-layer" v-if="obstacle">
      <span class="obstacle-icon" v-if="obstacle.type === 'ice' || obstacle.type === 'ice2'">❄️</span>
      <span class="obstacle-icon" v-else-if="obstacle.type === 'chain'">⛓️</span>
      <span class="obstacle-icon" v-else-if="obstacle.type === 'block'">🪨</span>
      <span v-if="obstacle.health > 1" class="obstacle-health">{{ obstacle.health }}</span>
    </div>
    
    <div class="hint-arrow" v-if="isHint && showHint"></div>
    
    <!-- 道具箭头 -->
    <div class="power-arrow horizontal" v-if="gem?.powerType === 'row'" :style="powerArrowStyle">
      <span class="arrow left">◀</span>
      <span class="arrow right">▶</span>
    </div>
    <div class="power-arrow vertical" v-if="gem?.powerType === 'col'" :style="powerArrowStyle">
      <span class="arrow up">▲</span>
      <span class="arrow down">▼</span>
    </div>
    <div class="power-wrap-indicator" v-if="gem?.powerType === 'wrap'" :style="powerArrowStyle">
      <span class="explosion-icon">💥</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { GEM_TYPES } from '../constants/gameConfig.js'

const props = defineProps({
  gem: {
    type: Object,
    default: null
  },
  obstacle: {
    type: Object,
    default: null
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  isMatched: {
    type: Boolean,
    default: false
  },
  isHint: {
    type: Boolean,
    default: false
  },
  showHint: {
    type: Boolean,
    default: false
  },
  index: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['click', 'swipe', 'interaction'])

const isSwiping = ref(false)
const swipeDirection = ref('')
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchEndX = ref(0)
const touchEndY = ref(0)
const isMouseDown = ref(false)

const gemEmoji = computed(() => {
  if (!props.gem) return ''
  return GEM_TYPES[props.gem.type]?.emoji || '💎'
})

const powerArrowStyle = computed(() => {
  if (!props.gem) return {}
  const gemType = GEM_TYPES[props.gem.type]
  if (!gemType) return {}
  
  const color = gemType.color
  return {
    '--arrow-color': color,
    '--arrow-shadow': `0 0 12px ${color}, 0 0 25px ${color}80`
  }
})

const gemStyle = computed(() => {
  if (!props.gem) return {}
  const gemType = GEM_TYPES[props.gem.type]
  const style = {
    backgroundColor: gemType?.color || '#ccc',
    boxShadow: `0 4px 8px ${gemType?.color}40, inset 0 -4px 8px rgba(0,0,0,0.2), inset 0 4px 8px rgba(255,255,255,0.3)`
  }
  
  if (props.gem?.dropFromRow !== null && props.gem?.dropToRow !== null) {
    const dropDistance = props.gem.dropToRow - props.gem.dropFromRow
    style['--fall-distance'] = Math.abs(dropDistance)
    style['--cell-size'] = '60px'
    
    const colIndex = props.index % 8
    const colDelay = colIndex * 0.02
    style.animationDelay = `${colDelay}s`
  }
  
  return style
})

const handleClick = () => {
  if (isSwiping.value) return
  emit('click')
  emit('interaction')
}

const handleTouchStart = (event) => {
  isSwiping.value = true
  touchStartX.value = event.touches[0].clientX
  touchStartY.value = event.touches[0].clientY
  touchEndX.value = event.touches[0].clientX
  touchEndY.value = event.touches[0].clientY
  swipeDirection.value = ''
  emit('interaction')
}

const handleTouchMove = (event) => {
  if (!isSwiping.value) return
  
  const currentX = event.touches[0].clientX
  const currentY = event.touches[0].clientY
  const deltaX = currentX - touchStartX.value
  const deltaY = currentY - touchStartY.value
  
  touchEndX.value = currentX
  touchEndY.value = currentY
  
  const threshold = 20
  if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      swipeDirection.value = deltaX > 0 ? 'right' : 'left'
    } else {
      swipeDirection.value = deltaY > 0 ? 'down' : 'up'
    }
  } else {
    swipeDirection.value = ''
  }
}

const handleTouchEnd = () => {
  if (!isSwiping.value) return
  
  const deltaX = touchEndX.value - touchStartX.value
  const deltaY = touchEndY.value - touchStartY.value
  const threshold = 30
  
  let finalDirection = ''
  
  if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      finalDirection = deltaX > 0 ? 'right' : 'left'
    } else {
      finalDirection = deltaY > 0 ? 'down' : 'up'
    }
    
    if (finalDirection) {
      emit('swipe', finalDirection)
    }
  }
  
  isSwiping.value = false
  swipeDirection.value = ''
  touchStartX.value = 0
  touchStartY.value = 0
  touchEndX.value = 0
  touchEndY.value = 0
}

const handleTouchCancel = () => {
  isSwiping.value = false
  swipeDirection.value = ''
  touchStartX.value = 0
  touchStartY.value = 0
  touchEndX.value = 0
  touchEndY.value = 0
}

const handleMouseDown = (event) => {
  isMouseDown.value = true
  isSwiping.value = false
  swipeDirection.value = ''
  touchStartX.value = event.clientX
  touchStartY.value = event.clientY
  touchEndX.value = event.clientX
  touchEndY.value = event.clientY
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  
  emit('interaction')
}

const handleMouseMove = (event) => {
  if (!isMouseDown.value) return
  
  const currentX = event.clientX
  const currentY = event.clientY
  
  // 更新结束坐标
  touchEndX.value = currentX
  touchEndY.value = currentY
  
  const deltaX = currentX - touchStartX.value
  const deltaY = currentY - touchStartY.value
  
  const threshold = 20
  if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
    isSwiping.value = true
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      swipeDirection.value = deltaX > 0 ? 'right' : 'left'
    } else {
      swipeDirection.value = deltaY > 0 ? 'down' : 'up'
    }
  }
}

const handleMouseUp = (event) => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  
  if (isSwiping.value) {
    const deltaX = touchEndX.value - touchStartX.value
    const deltaY = touchEndY.value - touchStartY.value
    const threshold = 30
    
    let finalDirection = ''
    
    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        finalDirection = deltaX > 0 ? 'right' : 'left'
      } else {
        finalDirection = deltaY > 0 ? 'down' : 'up'
      }
      
      if (finalDirection) {
        emit('swipe', finalDirection)
      }
    }
  } else {
    handleClick()
  }
  
  isMouseDown.value = false
  isSwiping.value = false
  swipeDirection.value = ''
  touchStartX.value = 0
  touchStartY.value = 0
  touchEndX.value = 0
  touchEndY.value = 0
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
  --shadow-soft: rgba(255, 107, 157, 0.3);
  --shadow-glow: rgba(255, 107, 157, 0.5);
}

.gem-cell {
  width: 100%;
  height: 100%;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.15s ease-out;
  position: relative;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  background: linear-gradient(145deg, var(--pearl-white) 0%, var(--lavender) 50%, var(--light-pink) 100%);
  box-shadow: 
    0 8px 25px var(--shadow-glow),
    inset 0 3px 8px rgba(255, 255, 255, 0.7),
    inset 0 -3px 8px rgba(255, 107, 157, 0.15);
  border: 4px solid var(--candy-pink);
}

.gem-cell.is-empty {
  background: rgba(255, 255, 255, 0.15);
  border: 3px dashed rgba(255, 107, 157, 0.35);
  box-shadow: none;
  cursor: default;
}

.gem-cell::before {
  content: '';
  position: absolute;
  top: 6px;
  left: 6px;
  right: 6px;
  bottom: 6px;
  border-radius: 12px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.5) 0%, transparent 50%);
  pointer-events: none;
}

.gem-cell::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  border-radius: 14px 14px 0 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, transparent 100%);
  pointer-events: none;
}

.gem-cell:hover:not(.has-obstacle-block) {
  transform: scale(1.1) translateY(-4px);
  box-shadow: 
    0 12px 35px var(--shadow-glow),
    inset 0 4px 10px rgba(255, 255, 255, 0.8),
    inset 0 -4px 10px rgba(255, 107, 157, 0.2);
}

.gem-cell.is-selected {
  transform: scale(1.18) translateY(-6px);
  box-shadow: 
    0 0 30px rgba(255, 107, 157, 0.95), 
    0 0 60px rgba(255, 107, 157, 0.6),
    0 12px 35px var(--shadow-glow) !important;
  z-index: 10;
  border-color: var(--gold);
  animation: candySelectedGlow 1.5s ease-in-out infinite;
}

@keyframes candySelectedGlow {
  0%, 100% { 
    box-shadow: 0 0 30px rgba(255, 107, 157, 0.95), 0 0 60px rgba(255, 107, 157, 0.6), 0 12px 35px var(--shadow-glow);
    transform: scale(1.18) translateY(-6px);
  }
  50% { 
    box-shadow: 0 0 45px rgba(255, 107, 157, 1), 0 0 90px rgba(255, 107, 157, 0.8), 0 15px 40px var(--shadow-glow);
    transform: scale(1.22) translateY(-8px);
  }
}

.gem-cell.is-matched {
  animation: matchPulse 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.gem-cell.is-new {
  animation: dropIn 0.7s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

.gem-cell.is-swiping {
  cursor: grabbing;
  transform: scale(1.05);
  transition: transform 0.15s ease-out;
}

.gem-cell.swipe-transform {
  transition: transform 0.15s ease-out;
}

.gem-cell.swipe-up {
  transform: translateY(-30px) scale(1.08);
}

.gem-cell.swipe-down {
  transform: translateY(30px) scale(1.08);
}

.gem-cell.swipe-left {
  transform: translateX(-30px) scale(1.08);
}

.gem-cell.swipe-right {
  transform: translateX(30px) scale(1.08);
}

.gem-emoji {
  font-size: 2.4rem;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.35));
  position: relative;
  z-index: 2;
  animation: float 2.5s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-4px) rotate(3deg); }
}

/* 障碍样式 */
.obstacle-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  pointer-events: none;
}

.obstacle-icon {
  font-size: 2rem;
  filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.45));
}

.gem-cell.has-obstacle-ice .obstacle-layer {
  background: radial-gradient(circle, rgba(168, 230, 207, 0.6) 0%, rgba(127, 219, 202, 0.4) 100%);
  animation: iceShimmer 2.2s ease-in-out infinite;
}

.gem-cell.has-obstacle-ice2 .obstacle-layer {
  background: radial-gradient(circle, rgba(127, 219, 202, 0.7) 0%, rgba(107, 201, 184, 0.5) 100%);
  animation: iceShimmer 2.2s ease-in-out infinite;
}

.gem-cell.has-obstacle-chain .obstacle-layer {
  background: radial-gradient(circle, rgba(255, 107, 157, 0.45) 0%, rgba(255, 182, 193, 0.35) 100%);
}

.gem-cell.has-obstacle-block .obstacle-layer {
  background: radial-gradient(circle, rgba(155, 89, 182, 0.65) 0%, rgba(142, 68, 173, 0.45) 100%);
}

.gem-cell.has-obstacle-block {
  cursor: not-allowed;
}

@keyframes iceShimmer {
  0%, 100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.35);
  }
}

.obstacle-health {
  position: absolute;
  top: 5px;
  right: 5px;
  background: linear-gradient(145deg, var(--candy-pink) 0%, var(--candy-pink-light) 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 12px;
  box-shadow: 0 3px 8px var(--shadow-soft);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .gem-emoji {
    font-size: 1.6rem;
  }
  
  .obstacle-icon {
    font-size: 1.5rem;
  }
  
  .gem-cell {
    border-width: 3px;
    border-radius: 12px;
  }
  
  .gem-cell.is-selected {
    transform: scale(1.12);
  }
}

@media (max-width: 480px) {
  .gem-emoji {
    font-size: 1.35rem;
  }
  
  .obstacle-icon {
    font-size: 1.25rem;
  }
  
  .gem-cell {
    border-width: 2.5px;
    border-radius: 10px;
  }
  
  .gem-cell.is-selected {
    transform: scale(1.08);
  }
  
  .gem-cell::before {
    top: 4px;
    left: 4px;
    right: 4px;
    bottom: 4px;
    border-radius: 8px;
  }
}

@media (max-width: 360px) {
  .gem-emoji {
    font-size: 1.15rem;
  }
  
  .obstacle-icon {
    font-size: 1.05rem;
  }
  
  .gem-cell {
    border-width: 2px;
    border-radius: 8px;
  }
  
  .gem-cell.is-selected {
    transform: scale(1.06);
  }
  
  .gem-cell::before {
    top: 3px;
    left: 3px;
    right: 3px;
    bottom: 3px;
    border-radius: 6px;
  }
}

@media (max-width: 320px) {
  .gem-emoji {
    font-size: 1rem;
  }
  
  .gem-cell {
    border-width: 2px;
    border-radius: 6px;
  }
  
  .gem-cell::before {
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    border-radius: 5px;
  }
}

@keyframes matchPulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.25);
    opacity: 0.85;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}

@keyframes dropIn {
  0% {
    transform: translateY(-350px);
    opacity: 0;
  }
  50% {
    transform: translateY(12px);
    opacity: 1;
  }
  70% {
    transform: translateY(-6px);
  }
  85% {
    transform: translateY(3px);
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fallDown {
  0% {
    transform: translateY(0);
  }
  60% {
    transform: translateY(calc(var(--cell-size, 60px) * var(--fall-distance, 1)));
  }
  75% {
    transform: translateY(calc((var(--cell-size, 60px) * var(--fall-distance, 1)) - 8px));
  }
  90% {
    transform: translateY(calc((var(--cell-size, 60px) * var(--fall-distance, 1)) + 4px));
  }
  100% {
    transform: translateY(calc(var(--cell-size, 60px) * var(--fall-distance, 1)));
  }
}

.gem-cell.is-new {
  animation: dropIn 0.4s cubic-bezier(0.25, 0.5, 0.3, 1) forwards;
}

.gem-cell.is-falling {
  animation: fallDown 0.35s cubic-bezier(0.25, 0.5, 0.3, 1) forwards;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

.gem-cell.is-hint {
  animation: hintPulse 1.3s ease-in-out infinite;
  border-color: var(--mint-green);
  box-shadow: 
    0 0 25px rgba(127, 219, 202, 0.9),
    0 0 50px rgba(127, 219, 202, 0.5),
    0 8px 25px var(--shadow-glow),
    inset 0 4px 8px rgba(255, 255, 255, 0.7),
    inset 0 -4px 8px rgba(255, 107, 157, 0.2);
}

@keyframes hintPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 
      0 0 25px rgba(127, 219, 202, 0.9),
      0 0 50px rgba(127, 219, 202, 0.5),
      0 8px 25px var(--shadow-glow),
      inset 0 4px 8px rgba(255, 255, 255, 0.7),
      inset 0 -4px 8px rgba(255, 107, 157, 0.2);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 
      0 0 35px rgba(127, 219, 202, 1),
      0 0 70px rgba(127, 219, 202, 0.7),
      0 10px 30px var(--shadow-glow),
      inset 0 4px 8px rgba(255, 255, 255, 0.8),
      inset 0 -4px 8px rgba(255, 107, 157, 0.25);
  }
}

.hint-arrow {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 32px;
  height: 32px;
  background: linear-gradient(145deg, var(--mint-green) 0%, #6BC9B8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: hintArrowBounce 0.9s ease-in-out infinite;
  box-shadow: 0 5px 15px rgba(127, 219, 202, 0.7);
  z-index: 20;
  border: 3px solid white;
}

.hint-arrow::before {
  content: '';
  width: 16px;
  height: 16px;
  background: white;
  clip-path: polygon(0 50%, 40% 20%, 40% 40%, 60% 40%, 60% 20%, 100% 50%, 60% 80%, 60% 60%, 40% 60%, 40% 80%);
  animation: swapArrow 0.7s ease-in-out infinite;
}

@keyframes hintArrowBounce {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-8px) scale(1.12);
  }
}

@keyframes swapArrow {
  0%, 100% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.12);
  }
}

.gem-cell.is-hint .gem-emoji {
  animation: hintFloat 1.2s ease-in-out infinite;
}

@keyframes hintFloat {
  0%, 100% {
    transform: translateY(0) rotate(-3deg) scale(1);
  }
  50% {
    transform: translateY(-8px) rotate(3deg) scale(1.12);
  }
}

/* 四消道具水果样式 - 直线道具 */
.gem-cell.is-power-row,
.gem-cell.is-power-col {
  border-color: var(--sunny-yellow);
  animation: linePowerGlow 1.6s ease-in-out infinite;
}

@keyframes linePowerGlow {
  0%, 100% {
    box-shadow: 
      0 0 18px rgba(255, 217, 61, 0.8),
      0 0 36px rgba(255, 217, 61, 0.5),
      0 8px 25px var(--shadow-glow),
      inset 0 4px 8px rgba(255, 255, 255, 0.7),
      inset 0 -4px 8px rgba(255, 107, 157, 0.2);
  }
  50% {
    box-shadow: 
      0 0 30px rgba(255, 217, 61, 1),
      0 0 60px rgba(255, 217, 61, 0.7),
      0 10px 30px var(--shadow-glow),
      inset 0 4px 8px rgba(255, 255, 255, 0.8),
      inset 0 -4px 8px rgba(255, 107, 157, 0.25);
  }
}

/* 包装炸弹道具 */
.gem-cell.is-power-wrap {
  border-color: var(--candy-purple);
  animation: wrapPowerGlow 1.3s ease-in-out infinite;
}

@keyframes wrapPowerGlow {
  0%, 100% {
    box-shadow: 
      0 0 18px rgba(155, 89, 182, 0.8),
      0 0 36px rgba(155, 89, 182, 0.5),
      0 8px 25px var(--shadow-glow),
      inset 0 4px 8px rgba(255, 255, 255, 0.7),
      inset 0 -4px 8px rgba(255, 107, 157, 0.2);
  }
  50% {
    box-shadow: 
      0 0 30px rgba(155, 89, 182, 1),
      0 0 60px rgba(155, 89, 182, 0.7),
      0 10px 30px var(--shadow-glow),
      inset 0 4px 8px rgba(255, 255, 255, 0.8),
      inset 0 -4px 8px rgba(255, 107, 157, 0.25);
  }
}

.power-wrap-indicator {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 15;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.power-wrap-indicator .explosion-icon {
  font-size: 1.6rem;
  animation: explosionPulse 0.9s ease-in-out infinite;
  filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.35));
}

@keyframes explosionPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.25);
  }
}

/* 五消道具水果样式 - 彩虹道具 */
.gem-cell.is-power-rainbow {
  border-color: var(--candy-pink);
  animation: rainbowGlow 1.3s ease-in-out infinite;
}

@keyframes rainbowGlow {
  0%, 100% {
    box-shadow: 
      0 0 25px rgba(255, 107, 157, 0.9),
      0 0 50px rgba(255, 107, 157, 0.6),
      0 8px 25px var(--shadow-glow),
      inset 0 4px 8px rgba(255, 255, 255, 0.7),
      inset 0 -4px 8px rgba(255, 107, 157, 0.2);
  }
  25% {
    box-shadow: 
      0 0 30px rgba(127, 219, 202, 0.9),
      0 0 60px rgba(127, 219, 202, 0.6),
      0 10px 30px rgba(127, 219, 202, 0.4),
      inset 0 4px 8px rgba(255, 255, 255, 0.8),
      inset 0 -4px 8px rgba(255, 107, 157, 0.25);
  }
  50% {
    box-shadow: 
      0 0 30px rgba(255, 217, 61, 0.9),
      0 0 60px rgba(255, 217, 61, 0.6),
      0 10px 30px rgba(255, 217, 61, 0.4),
      inset 0 4px 8px rgba(255, 255, 255, 0.8),
      inset 0 -4px 8px rgba(255, 107, 157, 0.25);
  }
  75% {
    box-shadow: 
      0 0 30px rgba(155, 89, 182, 0.9),
      0 0 60px rgba(155, 89, 182, 0.6),
      0 10px 30px rgba(155, 89, 182, 0.4),
      inset 0 4px 8px rgba(255, 255, 255, 0.8),
      inset 0 -4px 8px rgba(255, 107, 157, 0.25);
  }
}

/* 道具箭头 */
.power-arrow {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 15;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.power-arrow.horizontal {
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 3px;
}

.power-arrow.vertical {
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3px 0;
}

.power-arrow .arrow {
  font-size: 22px;
  font-weight: 900;
  color: var(--arrow-color, var(--sunny-yellow));
  text-shadow: var(--arrow-shadow, 0 0 15px var(--sunny-yellow), 0 0 30px rgba(255, 217, 61, 0.9));
  animation: arrowPulse 0.9s ease-in-out infinite;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
}

.power-arrow.horizontal .arrow.left {
  animation-delay: 0s;
}

.power-arrow.horizontal .arrow.right {
  animation-delay: 0.3s;
}

.power-arrow.vertical .arrow.up {
  animation-delay: 0s;
}

.power-arrow.vertical .arrow.down {
  animation-delay: 0.3s;
}

@keyframes arrowPulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
  }
  50% {
    opacity: 1;
    transform: scale(1.35);
    filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.5));
  }
}

/* 四消道具水果的emoji效果 */
.gem-cell.is-power-row .gem-emoji,
.gem-cell.is-power-col .gem-emoji {
  animation: powerFloat 1.3s ease-in-out infinite;
}

@keyframes powerFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-5px) scale(1.08);
  }
}

/* 包装炸弹道具的emoji效果 */
.gem-cell.is-power-wrap .gem-emoji {
  animation: wrapFloat 1.1s ease-in-out infinite;
}

@keyframes wrapFloat {
  0%, 100% {
    transform: translateY(0) scale(1) rotate(-6deg);
  }
  50% {
    transform: translateY(-6px) scale(1.1) rotate(6deg);
  }
}

/* 五消彩虹道具水果的emoji效果 */
.gem-cell.is-power-rainbow .gem-emoji {
  animation: rainbowFloat 1.6s ease-in-out infinite;
}

@keyframes rainbowFloat {
  0%, 100% {
    transform: translateY(0) scale(1) rotate(-6deg);
    filter: hue-rotate(0deg);
  }
  25% {
    transform: translateY(-8px) scale(1.12) rotate(6deg);
    filter: hue-rotate(90deg);
  }
  50% {
    transform: translateY(-5px) scale(1.08) rotate(-4deg);
    filter: hue-rotate(180deg);
  }
  75% {
    transform: translateY(-8px) scale(1.12) rotate(4deg);
    filter: hue-rotate(270deg);
  }
}

@media (max-width: 768px) {
  .power-arrow .arrow {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .power-arrow .arrow {
    font-size: 15px;
  }
}

@media (max-width: 360px) {
  .power-arrow .arrow {
    font-size: 13px;
  }
}
</style>

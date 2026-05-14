<template>
  <div class="game-board">
    <div class="grid-container">
      <div
        v-for="(row, rowIndex) in grid"
        :key="rowIndex"
        class="grid-row"
      >
        <GemCell
          v-for="(gem, colIndex) in row"
          :key="gem?.id || `${rowIndex}-${colIndex}`"
          :gem="gem"
          :obstacle="obstacleGrid?.[rowIndex]?.[colIndex]"
          :index="rowIndex * 8 + colIndex"
          :is-selected="isSelected(rowIndex, colIndex)"
          :is-matched="isMatched(rowIndex, colIndex)"
          :is-hint="isHint(rowIndex, colIndex)"
          :show-hint="showHint"
          @click="handleCellClick(rowIndex, colIndex)"
          @swipe="handleCellSwipe(rowIndex, colIndex, $event)"
          @interaction="handleInteraction"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import GemCell from './GemCell.vue'

const props = defineProps({
  grid: {
    type: Array,
    required: true
  },
  obstacleGrid: {
    type: Array,
    default: () => []
  },
  selectedCell: {
    type: Object,
    default: null
  },
  matchedCells: {
    type: Array,
    default: () => []
  },
  hintCells: {
    type: Array,
    default: null
  },
  showHint: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['cell-click', 'cell-swipe', 'cell-interaction'])

const isSelected = (row, col) => {
  return props.selectedCell?.row === row && props.selectedCell?.col === col
}

const isMatched = (row, col) => {
  return props.matchedCells.some(cell => cell.row === row && cell.col === col)
}

const isHint = (row, col) => {
  return props.hintCells?.some(cell => cell.row === row && cell.col === col)
}

const handleCellClick = (row, col) => {
  emit('cell-click', row, col)
  emit('cell-interaction')
}

const handleCellSwipe = (row, col, direction) => {
  emit('cell-swipe', row, col, direction)
  emit('cell-interaction')
}

const handleInteraction = () => {
  emit('cell-interaction')
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

.game-board {
  background: linear-gradient(145deg, var(--candy-pink) 0%, #FF5887 50%, #E85A7F 100%);
  padding: 22px;
  border-radius: 30px;
  box-shadow: 
    0 18px 60px var(--shadow-glow),
    inset 0 3px 6px rgba(255, 255, 255, 0.25),
    0 0 40px var(--shadow-soft);
  position: relative;
  border: 6px solid var(--candy-pink);
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

.game-board::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  border-radius: 22px;
  background: linear-gradient(145deg, var(--pearl-white) 0%, var(--lavender) 30%, var(--light-pink) 70%, var(--candy-pink-light) 100%);
  pointer-events: none;
}

.game-board::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 10px;
  border-radius: 24px 24px 0 0;
  background: linear-gradient(90deg, var(--gold) 0%, #FFE066 50%, var(--gold) 100%);
  opacity: 0.95;
}

.grid-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  z-index: 2;
}

.grid-row {
  display: flex;
  gap: 12px;
}

.grid-row > * {
  width: 60px;
  height: 60px;
}

@media (max-width: 768px) {
  .game-board {
    padding: 14px;
  }
  
  .grid-container {
    gap: 8px;
  }
  
  .grid-row {
    gap: 8px;
  }
  
  .grid-row > * {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 480px) {
  .game-board {
    padding: 12px;
  }
  
  .grid-row > * {
    width: 42px;
    height: 42px;
  }
  
  .grid-container {
    gap: 6px;
  }
  
  .grid-row {
    gap: 6px;
  }
}

@media (max-width: 360px) {
  .game-board {
    padding: 10px;
  }
  
  .grid-row > * {
    width: 36px;
    height: 36px;
  }
  
  .grid-container {
    gap: 4px;
  }
  
  .grid-row {
    gap: 4px;
  }
}

@media (max-width: 320px) {
  .game-board {
    padding: 8px;
  }
  
  .grid-row > * {
    width: 32px;
    height: 32px;
  }
  
  .grid-container {
    gap: 3px;
  }
  
  .grid-row {
    gap: 3px;
  }
}
</style>

import { ref, reactive, computed } from 'vue'
import { 
  GRID_SIZE, 
  GEM_TYPES, 
  MATCH_MINIMUM, 
  POWER_TYPES, 
  OBSTACLE_TYPES 
} from '../constants/gameConfig.js'
import { useSoundEffects } from './useSoundEffects.js'

export function useGameLogic() {
  // ============================================
  // 游戏状态
  // ============================================
  const grid = ref([])
  const score = ref(0)
  const moves = ref(0)
  const combo = ref(0)
  const selectedCell = ref(null)
  const isAnimating = ref(false)
  const matchedCells = ref([])
  const currentLevel = ref(null)

  // 任务进度
  const taskProgress = reactive({})

  // 障碍网格
  const obstacleGrid = ref([])

  // 监听回调
  let matchListeners = []
  let moveListeners = []

  const { playMatchSound, playChainSound, playSwapSound, playErrorSound, playDropSound } = useSoundEffects()

  // ============================================
  // 初始化函数
  // ============================================

  /**
   * 初始化关卡
   */
  const initLevel = (levelData) => {
    currentLevel.value = levelData
    score.value = 0
    moves.value = levelData.moves
    combo.value = 0

    // 重置任务进度
    Object.keys(taskProgress).forEach(key => delete taskProgress[key])
    levelData.tasks.forEach(task => {
      if (task.type === 'fruits') {
        taskProgress[`fruit_${task.fruitId}`] = 0
      } else if (task.type === 'obstacles') {
        taskProgress[`obstacle_${task.obstacleType}`] = 0
      }
    })

    // 初始化障碍网格
    initObstacleGrid(levelData.obstacles)

    // 初始化游戏棋盘
    initializeGrid()

    // 处理初始匹配（但不让用户得分，只是清理）
    let initialMatches = findMatches()
    while (initialMatches.length > 0) {
      initialMatches.forEach(({ row, col }) => {
        grid.value[row][col] = generateRandomGem()
      })
      initialMatches = findMatches()
    }
  }

  /**
   * 初始化障碍网格
   */
  const initObstacleGrid = (obstacles) => {
    obstacleGrid.value = []
    for (let row = 0; row < GRID_SIZE; row++) {
      obstacleGrid.value.push([])
      for (let col = 0; col < GRID_SIZE; col++) {
        obstacleGrid.value[row].push(null)
      }
    }

    obstacles.forEach(obs => {
      obstacleGrid.value[obs.row][obs.col] = {
        type: obs.type,
        health: obs.type === OBSTACLE_TYPES.ICE_DOUBLE ? 2 : 1
      }
    })
  }

  /**
   * 生成随机水果
   */
  const generateRandomGem = () => {
    return {
      type: Math.floor(Math.random() * GEM_TYPES.length),
      id: `gem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      powerType: null,
      isNew: true,
      isFalling: false,
      dropFromRow: null,
      dropToRow: null
    }
  }

  /**
   * 初始化游戏网格
   */
  const initializeGrid = () => {
    grid.value = []
    for (let row = 0; row < GRID_SIZE; row++) {
      grid.value.push([])
      for (let col = 0; col < GRID_SIZE; col++) {
        // 如果是障碍物位置，不生成水果
        if (obstacleGrid.value[row][col]?.type === OBSTACLE_TYPES.BLOCK) {
          grid.value[row].push(null)
        } else {
          grid.value[row].push(generateRandomGem())
        }
      }
    }

    // 移除 isNew 标记
    setTimeout(() => {
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          if (grid.value[row][col]) {
            grid.value[row][col].isNew = false
          }
        }
      }
    }, 500)
  }

  // ============================================
  // 匹配检测函数
  // ============================================

  /**
   * 查找所有匹配
   */
  const findMatches = () => {
    const matches = []
    const seen = new Set()

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const gem = grid.value[row][col]
        if (!gem) continue

        const horizontalMatch = findHorizontalMatch(row, col)
        const verticalMatch = findVerticalMatch(row, col)

        if (horizontalMatch.length >= MATCH_MINIMUM) {
          horizontalMatch.forEach(cell => {
            const key = `${cell.row}-${cell.col}`
            if (!seen.has(key)) {
              seen.add(key)
              matches.push({ ...cell, matchType: 'horizontal', length: horizontalMatch.length })
            }
          })
        }

        if (verticalMatch.length >= MATCH_MINIMUM) {
          verticalMatch.forEach(cell => {
            const key = `${cell.row}-${cell.col}`
            if (!seen.has(key)) {
              seen.add(key)
              matches.push({ ...cell, matchType: 'vertical', length: verticalMatch.length })
            }
          })
        }
      }
    }

    return matches
  }

  /**
   * 查找横向匹配
   */
  const findHorizontalMatch = (row, col) => {
    const gem = grid.value[row][col]
    if (!gem) return []

    const match = [{ row, col }]
    const type = gem.type

    for (let c = col - 1; c >= 0 && grid.value[row][c]?.type === type; c--) {
      match.unshift({ row, col: c })
    }
    for (let c = col + 1; c < GRID_SIZE && grid.value[row][c]?.type === type; c++) {
      match.push({ row, col: c })
    }

    return match
  }

  /**
   * 查找纵向匹配
   */
  const findVerticalMatch = (row, col) => {
    const gem = grid.value[row][col]
    if (!gem) return []

    const match = [{ row, col }]
    const type = gem.type

    for (let r = row - 1; r >= 0 && grid.value[r][col]?.type === type; r--) {
      match.unshift({ row: r, col })
    }
    for (let r = row + 1; r < GRID_SIZE && grid.value[r][col]?.type === type; r++) {
      match.push({ row: r, col })
    }

    return match
  }

  /**
   * 收集匹配组（用于生成道具）
   */
  const collectMatchGroups = () => {
    const groups = []
    const seen = new Set()

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const gem = grid.value[row][col]
        if (!gem) continue

        const horizontalMatch = findHorizontalMatch(row, col)
        const verticalMatch = findVerticalMatch(row, col)

        // 处理横向匹配组
        if (horizontalMatch.length >= 4) {
          const key = `h-${horizontalMatch[0].row}-${horizontalMatch[0].col}`
          if (!seen.has(key)) {
            seen.add(key)
            groups.push({
              type: 'horizontal',
              cells: [...horizontalMatch],
              length: horizontalMatch.length
            })
          }
        }

        // 处理纵向匹配组
        if (verticalMatch.length >= 4) {
          const key = `v-${verticalMatch[0].row}-${verticalMatch[0].col}`
          if (!seen.has(key)) {
            seen.add(key)
            groups.push({
              type: 'vertical',
              cells: [...verticalMatch],
              length: verticalMatch.length
            })
          }
        }

        // 检查 T/L 型匹配
        if (horizontalMatch.length >= 3 && verticalMatch.length >= 3) {
          const key = `wrap-${row}-${col}`
          if (!seen.has(key)) {
            seen.add(key)
            const allCells = [...new Set([
              ...horizontalMatch,
              ...verticalMatch
            ].map(c => `${c.row}-${c.col}`))].map(k => {
              const [r, c] = k.split('-').map(Number)
              return { row: r, col: c }
            })
            groups.push({
              type: 'wrap',
              cells: allCells,
              length: allCells.length
            })
          }
        }
      }
    }

    return groups
  }

  // ============================================
  // 道具系统
  // ============================================

  /**
   * 生成道具
   */
  const generatePowerGems = (matchGroups) => {
    const powerGems = []

    matchGroups.forEach(group => {
      const centerIndex = Math.floor(group.cells.length / 2)
      const centerCell = group.cells[centerIndex]
      const originalGem = grid.value[centerCell.row][centerCell.col]
      
      if (!originalGem) return

      let powerType = null

      if (group.length >= 5) {
        // 五消 → 彩虹
        powerType = POWER_TYPES.RAINBOW
      } else if (group.type === 'wrap') {
        // T/L 型 → 包装炸弹
        powerType = POWER_TYPES.WRAP
      } else if (group.length === 4) {
        // 四消 → 行或列炸弹
        powerType = group.type === 'horizontal' ? POWER_TYPES.ROW : POWER_TYPES.COL
      }

      if (powerType) {
        powerGems.push({
          row: centerCell.row,
          col: centerCell.col,
          type: originalGem.type,
          powerType: powerType
        })
      }
    })

    return powerGems
  }

  /**
   * 激活道具并获取影响范围
   */
  const getPowerEffectCells = (row, col, powerType, targetType = null) => {
    const affected = []

    switch (powerType) {
      case POWER_TYPES.ROW:
        // 消除整行（包括同行所有水果和障碍物）
        for (let c = 0; c < GRID_SIZE; c++) {
          affected.push({ row, col: c })
        }
        break

      case POWER_TYPES.COL:
        // 消除整列（包括同列所有水果和障碍物）
        for (let r = 0; r < GRID_SIZE; r++) {
          affected.push({ row: r, col })
        }
        break

      case POWER_TYPES.WRAP:
        // 3x3 范围
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = row + dr
            const nc = col + dc
            if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
              affected.push({ row: nr, col: nc })
            }
          }
        }
        break

      case POWER_TYPES.RAINBOW:
        // 消除所有同类水果
        if (targetType !== null && targetType !== undefined) {
          for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
              const gem = grid.value[r][c]
              if (gem && gem.type === targetType) {
                affected.push({ row: r, col: c })
              }
            }
          }
        } else {
          // 如果没有目标类型，就消除周围的
          affected.push({ row, col })
        }
        break
    }

    return affected
  }

  // ============================================
  // 障碍系统
  // ============================================

  /**
   * 伤害障碍
   */
  const damageObstacle = (row, col) => {
    const obstacle = obstacleGrid.value[row][col]
    if (!obstacle) return { destroyed: false }

    obstacle.health--

    if (obstacle.health <= 0) {
      // 更新任务进度
      const obstacleType = obstacle.type === OBSTACLE_TYPES.ICE_DOUBLE ? OBSTACLE_TYPES.ICE : obstacle.type
      const taskKey = `obstacle_${obstacleType}`
      if (taskProgress[taskKey] !== undefined) {
        taskProgress[taskKey]++
      }

      obstacleGrid.value[row][col] = null
      return { destroyed: true, type: obstacle.type }
    } else if (obstacle.type === OBSTACLE_TYPES.ICE_DOUBLE) {
      // 双层变单层
      obstacle.type = OBSTACLE_TYPES.ICE
    }

    return { destroyed: false, type: obstacle.type }
  }

  // ============================================
  // 消除和下落逻辑
  // ============================================

  /**
   * 消除匹配的水果（包括触发被消除道具的效果）
   */
  const removeMatches = (matches, powerGems = []) => {
    const removedGems = []
    const destroyedObstacles = []
    const powerEffects = [] // 收集被消除道具的效果范围

    // 收集要消除的水果信息，并检查是否有道具需要触发
    matches.forEach(({ row, col }) => {
      const gem = grid.value[row][col]
      if (gem) {
        removedGems.push({
          row,
          col,
          type: gem.type,
          isPower: !!gem.powerType
        })

        // 如果被消除的是道具，触发其效果
        if (gem.powerType) {
          const affected = getPowerEffectCells(row, col, gem.powerType)
          powerEffects.push(...affected)
        }
      }
    })

    // 将道具效果范围加入到要消除的格子中
    const allMatches = new Set()
    matches.forEach(m => allMatches.add(`${m.row}-${m.col}`))
    powerEffects.forEach(e => allMatches.add(`${e.row}-${e.col}`))

    // 将集合转换为数组
    const finalMatches = Array.from(allMatches).map(key => {
      const [r, c] = key.split('-').map(Number)
      return { row: r, col: c }
    })

    // 收集道具效果范围内的所有水果（在消除之前！）
    powerEffects.forEach(({ row, col }) => {
      const gem = grid.value[row][col]
      if (gem && !removedGems.some(g => g.row === row && g.col === col)) {
        removedGems.push({
          row,
          col,
          type: gem.type,
          isPower: !!gem.powerType
        })
      }
    })

    // 处理障碍 - 无论是普通匹配还是道具效果，都要伤害障碍
    finalMatches.forEach(({ row, col }) => {
      const obstacleResult = damageObstacle(row, col)
      if (obstacleResult.destroyed) {
        destroyedObstacles.push(obstacleResult)
      }
    })

    // 消除水果
    finalMatches.forEach(({ row, col }) => {
      // 检查是否是新生成的道具位置
      const isPowerGem = powerGems.some(p => p.row === row && p.col === col)
      if (!isPowerGem) {
        grid.value[row][col] = null
      }
    })

    // 放置道具
    powerGems.forEach(powerGem => {
      grid.value[powerGem.row][powerGem.col] = {
        type: powerGem.type,
        powerType: powerGem.powerType,
        id: `power-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        isNew: true,
        isFalling: false
      }
    })

    // 更新得分
    const baseScore = finalMatches.length * 10
    const comboBonus = combo.value * 5
    const powerBonus = (powerGems.length + powerEffects.length) * 20 // 道具额外加分
    score.value += baseScore + comboBonus + powerBonus

    // 更新任务进度
    removedGems.forEach(gem => {
      const taskKey = `fruit_${gem.type}`
      if (taskProgress[taskKey] !== undefined) {
        taskProgress[taskKey]++
      }
    })

    playMatchSound()

    // 通知监听器
    matchListeners.forEach(listener => listener({
      removedGems,
      destroyedObstacles,
      score: baseScore + comboBonus + powerBonus,
      combo: combo.value
    }))

    return { removedGems, destroyedObstacles }
  }

  /**
   * 水果下落
   */
  const dropGems = () => {
    let hasDropped = false

    for (let col = 0; col < GRID_SIZE; col++) {
      let emptyRow = GRID_SIZE - 1

      // 从下往上找空位，让水果下落
      for (let row = GRID_SIZE - 1; row >= 0; row--) {
        // 跳过障碍
        if (obstacleGrid.value[row][col]?.type === OBSTACLE_TYPES.BLOCK) {
          continue
        }

        if (grid.value[row][col] !== null) {
          if (row !== emptyRow) {
            grid.value[emptyRow][col] = grid.value[row][col]
            grid.value[emptyRow][col].isFalling = true
            grid.value[emptyRow][col].dropFromRow = row
            grid.value[emptyRow][col].dropToRow = emptyRow
            grid.value[row][col] = null
            hasDropped = true
          }
          emptyRow--
        }
      }

      // 生成新水果
      for (let row = emptyRow; row >= 0; row--) {
        // 检查是否有障碍
        if (obstacleGrid.value[row][col]?.type === OBSTACLE_TYPES.BLOCK) {
          continue
        }

        grid.value[row][col] = generateRandomGem()
        grid.value[row][col].isNew = true
        grid.value[row][col].dropFromRow = -1
        grid.value[row][col].dropToRow = row
        hasDropped = true
      }
    }

    // 清理动画标记
    setTimeout(() => {
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          const gem = grid.value[row][col]
          if (gem) {
            gem.isNew = false
            gem.isFalling = false
            gem.dropFromRow = null
            gem.dropToRow = null
          }
        }
      }
    }, 400)

    if (hasDropped) {
      playDropSound()
    }

    return hasDropped
  }

  // ============================================
  // 核心游戏流程
  // ============================================

  /**
   * 处理交换
   */
  const swapGems = async (row1, col1, row2, col2) => {
    const gem1 = grid.value[row1][col1]
    const gem2 = grid.value[row2][col2]

    // 检查障碍
    if (obstacleGrid.value[row1][col1]?.type === OBSTACLE_TYPES.BLOCK ||
        obstacleGrid.value[row2][col2]?.type === OBSTACLE_TYPES.BLOCK) {
      playErrorSound()
      return false
    }

    // 检查锁链
    if (obstacleGrid.value[row1][col1]?.type === OBSTACLE_TYPES.CHAIN ||
        obstacleGrid.value[row2][col2]?.type === OBSTACLE_TYPES.CHAIN) {
      playErrorSound()
      return false
    }

    // 执行交换
    grid.value[row1][col1] = gem2
    grid.value[row2][col2] = gem1

    playSwapSound()
    await new Promise(resolve => setTimeout(resolve, 200))

    // 检查是否有道具触发
    const hasPowerTrigger = gem1?.powerType || gem2?.powerType

    if (hasPowerTrigger) {
      // 道具触发：收集所有要消除的格子
      let allAffectedCells = new Set()

      // 处理第一个道具（现在在 row2, col2 位置）
      if (gem1?.powerType) {
        let targetType = null
        if (gem1.powerType === POWER_TYPES.RAINBOW && gem2) {
          targetType = gem2.type
        }

        allAffectedCells.add(`${row2}-${col2}`)
        const affected = getPowerEffectCells(row2, col2, gem1.powerType, targetType)
        affected.forEach(cell => {
          allAffectedCells.add(`${cell.row}-${cell.col}`)
        })
      }

      // 处理第二个道具（现在在 row1, col1 位置）
      if (gem2?.powerType) {
        let targetType = null
        if (gem2.powerType === POWER_TYPES.RAINBOW && gem1) {
          targetType = gem1.type
        }

        allAffectedCells.add(`${row1}-${col1}`)
        const affected = getPowerEffectCells(row1, col1, gem2.powerType, targetType)
        affected.forEach(cell => {
          allAffectedCells.add(`${cell.row}-${cell.col}`)
        })
      }

      // 如果没有道具影响的位置，撤销交换
      if (allAffectedCells.size === 0) {
        grid.value[row1][col1] = gem1
        grid.value[row2][col2] = gem2
        playErrorSound()
        return false
      }

      // 转换为数组格式
      const powerMatches = Array.from(allAffectedCells).map(key => {
        const [row, col] = key.split('-').map(Number)
        return { row, col }
      })

      // 有匹配，消耗步数
      moves.value--
      moveListeners.forEach(listener => listener({ moves: moves.value }))

      // 处理道具效果
      await processMatchesWithPower(powerMatches)
    } else {
      // 普通匹配：检查是否有匹配
      let matches = findMatches()

      // 如果没有匹配，撤销交换
      if (matches.length === 0) {
        grid.value[row1][col1] = gem1
        grid.value[row2][col2] = gem2
        playErrorSound()
        return false
      }

      // 有匹配，消耗步数
      moves.value--
      moveListeners.forEach(listener => listener({ moves: moves.value }))

      // 处理普通匹配（会生成新道具）
      await processMatches()
    }

    return true
  }

  /**
   * 处理匹配链
   */
  const processMatches = async () => {
    combo.value = 0
    let matches = findMatches()

    while (matches.length > 0) {
      combo.value++

      if (combo.value > 1) {
        playChainSound()
      }

      matchedCells.value = matches
      await new Promise(resolve => setTimeout(resolve, 300))

      // 收集匹配组并生成道具
      const matchGroups = collectMatchGroups()
      const powerGems = generatePowerGems(matchGroups)

      // 消除匹配
      removeMatches(matches, powerGems)
      matchedCells.value = []

      await new Promise(resolve => setTimeout(resolve, 200))

      // 水果下落
      dropGems()
      await new Promise(resolve => setTimeout(resolve, 500))

      // 检查新的匹配
      matches = findMatches()
    }

    combo.value = 0
  }

  /**
   * 处理包含道具效果的匹配（包括消除整行/整列）
   */
  const processMatchesWithPower = async (initialMatches) => {
    combo.value = 0
    
    // 处理初始的匹配（可能包含道具效果触发的整行/整列消除）
    let matches = initialMatches

    while (matches.length > 0) {
      combo.value++

      if (combo.value > 1) {
        playChainSound()
      }

      matchedCells.value = matches
      await new Promise(resolve => setTimeout(resolve, 300))

      // 直接消除所有匹配的格子（不生成新道具，因为这些是道具触发的效果）
      const removedGems = []
      const destroyedObstacles = []
      matches.forEach(({ row, col }) => {
        const gem = grid.value[row][col]
        if (gem) {
          removedGems.push({
            row,
            col,
            type: gem.type,
            isPower: !!gem.powerType
          })
        }
        // 伤害障碍物
        const obstacleResult = damageObstacle(row, col)
        if (obstacleResult.destroyed) {
          destroyedObstacles.push(obstacleResult)
        }
        // 消除水果
        grid.value[row][col] = null
      })

      // 更新得分
      const baseScore = matches.length * 10
      const comboBonus = combo.value * 5
      score.value += baseScore + comboBonus

      // 更新任务进度
      removedGems.forEach(gem => {
        const taskKey = `fruit_${gem.type}`
        if (taskProgress[taskKey] !== undefined) {
          taskProgress[taskKey]++
        }
      })

      // 通知监听器
      matchListeners.forEach(listener => listener({
        removedGems,
        destroyedObstacles,
        score: baseScore + comboBonus,
        combo: combo.value
      }))

      playMatchSound()
      matchedCells.value = []

      await new Promise(resolve => setTimeout(resolve, 200))

      // 水果下落
      dropGems()
      await new Promise(resolve => setTimeout(resolve, 500))

      // 检查新的匹配（级联匹配会生成新道具）
      matches = findMatches()
    }

    combo.value = 0
  }

  /**
   * 处理点击
   */
  const handleCellClick = async (row, col) => {
    if (isAnimating.value) return

    // 障碍物不能点击
    if (obstacleGrid.value[row][col]?.type === OBSTACLE_TYPES.BLOCK) {
      return
    }

    if (!selectedCell.value) {
      selectedCell.value = { row, col }
      return
    }

    const { row: selRow, col: selCol } = selectedCell.value

    // 点击同一个格子，取消选择
    if (row === selRow && col === selCol) {
      selectedCell.value = null
      return
    }

    // 检查是否相邻
    const isAdjacent = (
      (Math.abs(row - selRow) === 1 && col === selCol) ||
      (Math.abs(col - selCol) === 1 && row === selRow)
    )

    if (!isAdjacent) {
      selectedCell.value = { row, col }
      return
    }

    // 执行交换
    isAnimating.value = true
    await swapGems(selRow, selCol, row, col)
    isAnimating.value = false

    selectedCell.value = null
  }

  /**
   * 处理滑动交换
   */
  const handleCellSwipe = async (row, col, direction) => {
    if (isAnimating.value) return

    // 障碍物不能滑动
    if (obstacleGrid.value[row][col]?.type === OBSTACLE_TYPES.BLOCK) {
      return
    }

    // 根据滑动方向计算目标位置
    let targetRow = row
    let targetCol = col

    switch (direction) {
      case 'up':
        targetRow = row - 1
        break
      case 'down':
        targetRow = row + 1
        break
      case 'left':
        targetCol = col - 1
        break
      case 'right':
        targetCol = col + 1
        break
      default:
        return
    }

    // 检查目标位置是否在棋盘范围内
    if (targetRow < 0 || targetRow >= GRID_SIZE || targetCol < 0 || targetCol >= GRID_SIZE) {
      return
    }

    // 检查目标位置是否有障碍物
    if (obstacleGrid.value[targetRow][targetCol]?.type === OBSTACLE_TYPES.BLOCK) {
      return
    }

    // 执行交换
    isAnimating.value = true
    await swapGems(row, col, targetRow, targetCol)
    isAnimating.value = false

    selectedCell.value = null
  }

  // ============================================
  // 检查游戏状态
  // ============================================

  /**
   * 检查是否胜利
   */
  const checkWin = computed(() => {
    if (!currentLevel.value) return false

    // 检查任务
    for (const task of currentLevel.value.tasks) {
      if (task.type === 'fruits') {
        if ((taskProgress[`fruit_${task.fruitId}`] || 0) < task.count) {
          return false
        }
      } else if (task.type === 'obstacles') {
        if ((taskProgress[`obstacle_${task.obstacleType}`] || 0) < task.count) {
          return false
        }
      } else if (task.type === 'score') {
        if (score.value < task.score) {
          return false
        }
      }
    }

    return true
  })

  /**
   * 检查是否失败
   */
  const checkLose = computed(() => {
    return moves.value <= 0 && !checkWin.value
  })

  // ============================================
  // 监听器
  // ============================================

  const addMatchListener = (callback) => {
    matchListeners.push(callback)
    return () => {
      matchListeners = matchListeners.filter(cb => cb !== callback)
    }
  }

  const addMoveListener = (callback) => {
    moveListeners.push(callback)
    return () => {
      moveListeners = moveListeners.filter(cb => cb !== callback)
    }
  }

  return {
    grid,
    obstacleGrid,
    score,
    moves,
    combo,
    selectedCell,
    isAnimating,
    matchedCells,
    currentLevel,
    taskProgress,
    initLevel,
    handleCellClick,
    handleCellSwipe,
    addMatchListener,
    addMoveListener,
    checkWin,
    checkLose,
    getLevelById: () => currentLevel.value
  }
}

// 游戏基础配置
export const GRID_SIZE = 8
export const MATCH_MINIMUM = 3

// 水果类型配置 - 开心消消乐风格
export const GEM_TYPES = [
  { id: 0, name: '苹果', emoji: '🍎', color: '#FF5252' },
  { id: 1, name: '橙子', emoji: '🍊', color: '#FF9800' },
  { id: 2, name: '葡萄', emoji: '🍇', color: '#9C27B0' },
  { id: 3, name: '柠檬', emoji: '🍋', color: '#FFEB3B' },
  { id: 4, name: '草莓', emoji: '🍓', color: '#E91E63' },
  { id: 5, name: '西瓜', emoji: '🍉', color: '#2196F3' }
]

// 道具类型配置
export const POWER_TYPES = {
  NONE: null,
  ROW: 'row',        // 四消横向 - 横扫千军
  COL: 'col',        // 四消纵向 - 竖劈万军
  WRAP: 'wrap',      // T/L型 - 包装炸弹
  RAINBOW: 'rainbow' // 五消 - 彩虹
}

// 障碍类型配置
export const OBSTACLE_TYPES = {
  NONE: null,
  ICE: 'ice',          // 冰块 - 需要消除覆盖的水果才能打破
  ICE_DOUBLE: 'ice2', // 双层冰块
  CHAIN: 'chain',     // 锁链 - 被锁住的水果
  BLOCK: 'block'      // 障碍物 - 完全不可移动
}

// 道具特效配置
export const POWER_EFFECTS = {
  [POWER_TYPES.ROW]: {
    name: '横向炸弹',
    effect: '消除整行'
  },
  [POWER_TYPES.COL]: {
    name: '纵向炸弹',
    effect: '消除整列'
  },
  [POWER_TYPES.WRAP]: {
    name: '包装炸弹',
    effect: '消除周围3x3'
  },
  [POWER_TYPES.RAINBOW]: {
    name: '彩虹道具',
    effect: '消除同类所有'
  }
}

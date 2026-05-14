// 25个精心设计的关卡，难度递增，包含趣味障碍
export const LEVELS = [
  // === 第1-5关：新手入门 ===
  {
    id: 1,
    name: '果园初遇',
    description: '欢迎来到水果乐园！交换相邻的水果，3个以上相同的即可消除！',
    gridSize: 8,
    moves: 25,
    targetScore: 500,
    tasks: [
      { type: 'fruits', fruitId: 0, count: 8 },
      { type: 'fruits', fruitId: 1, count: 8 }
    ],
    obstacles: [],
    hint: '试着找到3个相同的水果连在一起消除！'
  },
  {
    id: 2,
    name: '苹果满园',
    description: '收集美味的红苹果！',
    gridSize: 8,
    moves: 22,
    targetScore: 800,
    tasks: [
      { type: 'fruits', fruitId: 0, count: 15 }
    ],
    obstacles: [],
    hint: '多制造一些四消或五消的机会！'
  },
  {
    id: 3,
    name: '橙子飘香',
    description: '橙子大丰收！快收集它们！',
    gridSize: 8,
    moves: 24,
    targetScore: 1200,
    tasks: [
      { type: 'fruits', fruitId: 1, count: 12 },
      { type: 'fruits', fruitId: 0, count: 10 }
    ],
    obstacles: [],
    hint: '横向四消会生成横行炸弹！'
  },
  {
    id: 4,
    name: '紫色风暴',
    description: '神秘的紫葡萄正在等你！',
    gridSize: 8,
    moves: 22,
    targetScore: 1500,
    tasks: [
      { type: 'fruits', fruitId: 2, count: 15 },
      { type: 'score', score: 1000 }
    ],
    obstacles: [],
    hint: '纵向四消会生成纵向炸弹！'
  },
  {
    id: 5,
    name: '水果派对',
    description: '所有水果都来参加派对了！',
    gridSize: 8,
    moves: 25,
    targetScore: 2000,
    tasks: [
      { type: 'fruits', fruitId: 0, count: 10 },
      { type: 'fruits', fruitId: 1, count: 10 },
      { type: 'fruits', fruitId: 2, count: 10 }
    ],
    obstacles: [],
    hint: '五消会生成彩虹道具！'
  },

  // === 第6-10关：加入冰块 ===
  {
    id: 6,
    name: '冰雪初融',
    description: '小心！有些水果被冻住了！',
    gridSize: 8,
    moves: 22,
    targetScore: 2500,
    tasks: [
      { type: 'fruits', fruitId: 3, count: 12 },
      { type: 'obstacles', obstacleType: 'ice', count: 5 }
    ],
    obstacles: [
      { row: 2, col: 2, type: 'ice' },
      { row: 2, col: 5, type: 'ice' },
      { row: 5, col: 2, type: 'ice' },
      { row: 5, col: 5, type: 'ice' },
      { row: 3, col: 3, type: 'ice' }
    ],
    hint: '消除冰块旁边的水果可以打破冰块！'
  },
  {
    id: 7,
    name: '柠檬黄晨',
    description: '在晨光中收集柠檬！',
    gridSize: 8,
    moves: 24,
    targetScore: 3000,
    tasks: [
      { type: 'fruits', fruitId: 3, count: 18 },
      { type: 'obstacles', obstacleType: 'ice', count: 8 }
    ],
    obstacles: [
      { row: 1, col: 3, type: 'ice' },
      { row: 1, col: 4, type: 'ice' },
      { row: 6, col: 3, type: 'ice' },
      { row: 6, col: 4, type: 'ice' },
      { row: 3, col: 1, type: 'ice' },
      { row: 4, col: 1, type: 'ice' },
      { row: 3, col: 6, type: 'ice' },
      { row: 4, col: 6, type: 'ice' }
    ],
    hint: '道具爆炸也可以消除冰块！'
  },
  {
    id: 8,
    name: '草莓时节',
    description: '甜甜的草莓等你来！',
    gridSize: 8,
    moves: 22,
    targetScore: 3500,
    tasks: [
      { type: 'fruits', fruitId: 4, count: 15 },
      { type: 'obstacles', obstacleType: 'ice', count: 6 }
    ],
    obstacles: [
      { row: 2, col: 1, type: 'ice' },
      { row: 2, col: 6, type: 'ice' },
      { row: 5, col: 1, type: 'ice' },
      { row: 5, col: 6, type: 'ice' },
      { row: 3, col: 4, type: 'ice' },
      { row: 4, col: 3, type: 'ice' }
    ],
    hint: '连续消除可以制造连击！'
  },
  {
    id: 9,
    name: '冰天雪地',
    description: '好多冰块！小心前进！',
    gridSize: 8,
    moves: 26,
    targetScore: 4000,
    tasks: [
      { type: 'fruits', fruitId: 5, count: 20 },
      { type: 'obstacles', obstacleType: 'ice', count: 12 }
    ],
    obstacles: [
      { row: 1, col: 1, type: 'ice' },
      { row: 1, col: 2, type: 'ice' },
      { row: 1, col: 5, type: 'ice' },
      { row: 1, col: 6, type: 'ice' },
      { row: 6, col: 1, type: 'ice' },
      { row: 6, col: 2, type: 'ice' },
      { row: 6, col: 5, type: 'ice' },
      { row: 6, col: 6, type: 'ice' },
      { row: 3, col: 3, type: 'ice2' },
      { row: 3, col: 4, type: 'ice2' },
      { row: 4, col: 3, type: 'ice2' },
      { row: 4, col: 4, type: 'ice2' }
    ],
    hint: '双层冰块需要消除两次！'
  },
  {
    id: 10,
    name: '破冰前行',
    description: '最后的冰雪关卡！',
    gridSize: 8,
    moves: 28,
    targetScore: 5000,
    tasks: [
      { type: 'fruits', fruitId: 0, count: 15 },
      { type: 'fruits', fruitId: 2, count: 15 },
      { type: 'obstacles', obstacleType: 'ice', count: 15 }
    ],
    obstacles: [
      { row: 0, col: 0, type: 'ice' },
      { row: 0, col: 7, type: 'ice' },
      { row: 7, col: 0, type: 'ice' },
      { row: 7, col: 7, type: 'ice' },
      { row: 2, col: 3, type: 'ice2' },
      { row: 2, col: 4, type: 'ice2' },
      { row: 5, col: 3, type: 'ice2' },
      { row: 5, col: 4, type: 'ice2' },
      { row: 3, col: 1, type: 'ice' },
      { row: 3, col: 6, type: 'ice' },
      { row: 4, col: 1, type: 'ice' },
      { row: 4, col: 6, type: 'ice' },
      { row: 1, col: 3, type: 'ice' },
      { row: 1, col: 4, type: 'ice' },
      { row: 6, col: 3, type: 'ice' }
    ],
    hint: '彩虹道具是消除所有障碍的利器！'
  },

  // === 第11-15关：加入锁链 ===
  {
    id: 11,
    name: '锁链初现',
    description: '有些水果被锁住了！',
    gridSize: 8,
    moves: 25,
    targetScore: 5500,
    tasks: [
      { type: 'fruits', fruitId: 1, count: 18 },
      { type: 'obstacles', obstacleType: 'chain', count: 6 }
    ],
    obstacles: [
      { row: 2, col: 3, type: 'chain' },
      { row: 2, col: 4, type: 'chain' },
      { row: 5, col: 3, type: 'chain' },
      { row: 5, col: 4, type: 'chain' },
      { row: 3, col: 2, type: 'chain' },
      { row: 4, col: 5, type: 'chain' }
    ],
    hint: '被锁住的水果需要消除两次才能解锁！'
  },
  {
    id: 12,
    name: '金色橘子',
    description: '在锁链中寻找橘子！',
    gridSize: 8,
    moves: 26,
    targetScore: 6000,
    tasks: [
      { type: 'fruits', fruitId: 1, count: 20 },
      { type: 'obstacles', obstacleType: 'chain', count: 8 },
      { type: 'obstacles', obstacleType: 'ice', count: 4 }
    ],
    obstacles: [
      { row: 1, col: 2, type: 'chain' },
      { row: 1, col: 5, type: 'chain' },
      { row: 6, col: 2, type: 'chain' },
      { row: 6, col: 5, type: 'chain' },
      { row: 3, col: 0, type: 'chain' },
      { row: 3, col: 7, type: 'chain' },
      { row: 4, col: 0, type: 'chain' },
      { row: 4, col: 7, type: 'chain' },
      { row: 2, col: 3, type: 'ice' },
      { row: 2, col: 4, type: 'ice' },
      { row: 5, col: 3, type: 'ice' },
      { row: 5, col: 4, type: 'ice' }
    ],
    hint: '锁链和冰块可以一起消除！'
  },
  {
    id: 13,
    name: '紫色迷宫',
    description: '在锁链迷宫中找到葡萄！',
    gridSize: 8,
    moves: 28,
    targetScore: 6500,
    tasks: [
      { type: 'fruits', fruitId: 2, count: 22 },
      { type: 'obstacles', obstacleType: 'chain', count: 10 }
    ],
    obstacles: [
      { row: 0, col: 3, type: 'chain' },
      { row: 0, col: 4, type: 'chain' },
      { row: 7, col: 3, type: 'chain' },
      { row: 7, col: 4, type: 'chain' },
      { row: 2, col: 1, type: 'chain' },
      { row: 2, col: 6, type: 'chain' },
      { row: 5, col: 1, type: 'chain' },
      { row: 5, col: 6, type: 'chain' },
      { row: 3, col: 3, type: 'chain' },
      { row: 4, col: 4, type: 'chain' }
    ],
    hint: '包装炸弹是解决锁链的好方法！'
  },
  {
    id: 14,
    name: '双重困境',
    description: '冰块和锁链都来了！',
    gridSize: 8,
    moves: 30,
    targetScore: 7000,
    tasks: [
      { type: 'fruits', fruitId: 3, count: 20 },
      { type: 'obstacles', obstacleType: 'ice', count: 8 },
      { type: 'obstacles', obstacleType: 'chain', count: 8 }
    ],
    obstacles: [
      { row: 1, col: 1, type: 'ice' },
      { row: 1, col: 6, type: 'ice' },
      { row: 6, col: 1, type: 'ice' },
      { row: 6, col: 6, type: 'ice' },
      { row: 2, col: 3, type: 'chain' },
      { row: 2, col: 4, type: 'chain' },
      { row: 5, col: 3, type: 'chain' },
      { row: 5, col: 4, type: 'chain' },
      { row: 3, col: 1, type: 'ice2' },
      { row: 3, col: 6, type: 'ice2' },
      { row: 4, col: 1, type: 'chain' },
      { row: 4, col: 6, type: 'chain' },
      { row: 1, col: 3, type: 'chain' },
      { row: 6, col: 4, type: 'ice' },
      { row: 0, col: 4, type: 'chain' },
      { row: 7, col: 3, type: 'ice' }
    ],
    hint: '合理使用道具可以事半功倍！'
  },
  {
    id: 15,
    name: '解放水果',
    description: '拯救所有被锁住的水果！',
    gridSize: 8,
    moves: 32,
    targetScore: 8000,
    tasks: [
      { type: 'fruits', fruitId: 4, count: 25 },
      { type: 'obstacles', obstacleType: 'chain', count: 12 },
      { type: 'obstacles', obstacleType: 'ice', count: 8 }
    ],
    obstacles: [
      { row: 0, col: 2, type: 'chain' },
      { row: 0, col: 5, type: 'chain' },
      { row: 7, col: 2, type: 'chain' },
      { row: 7, col: 5, type: 'chain' },
      { row: 1, col: 3, type: 'ice2' },
      { row: 1, col: 4, type: 'ice2' },
      { row: 6, col: 3, type: 'ice2' },
      { row: 6, col: 4, type: 'ice2' },
      { row: 2, col: 1, type: 'chain' },
      { row: 2, col: 6, type: 'chain' },
      { row: 5, col: 1, type: 'chain' },
      { row: 5, col: 6, type: 'chain' },
      { row: 3, col: 3, type: 'chain' },
      { row: 3, col: 4, type: 'chain' },
      { row: 4, col: 3, type: 'ice' },
      { row: 4, col: 4, type: 'ice' },
      { row: 3, col: 0, type: 'ice' },
      { row: 4, col: 7, type: 'ice' }
    ],
    hint: '彩虹道具可以清除整个棋盘的障碍！'
  },

  // === 第16-20关：终极挑战 ===
  {
    id: 16,
    name: '水果大集合',
    description: '所有水果都来了！',
    gridSize: 8,
    moves: 30,
    targetScore: 9000,
    tasks: [
      { type: 'fruits', fruitId: 0, count: 15 },
      { type: 'fruits', fruitId: 1, count: 15 },
      { type: 'fruits', fruitId: 2, count: 15 }
    ],
    obstacles: [
      { row: 2, col: 2, type: 'block' },
      { row: 2, col: 5, type: 'block' },
      { row: 5, col: 2, type: 'block' },
      { row: 5, col: 5, type: 'block' }
    ],
    hint: '障碍物是无法消除的！绕过它们！'
  },
  {
    id: 17,
    name: '西瓜派对',
    description: '清凉的西瓜等你来！',
    gridSize: 8,
    moves: 28,
    targetScore: 10000,
    tasks: [
      { type: 'fruits', fruitId: 5, count: 30 },
      { type: 'obstacles', obstacleType: 'ice', count: 10 }
    ],
    obstacles: [
      { row: 1, col: 2, type: 'ice2' },
      { row: 1, col: 5, type: 'ice2' },
      { row: 6, col: 2, type: 'ice2' },
      { row: 6, col: 5, type: 'ice2' },
      { row: 3, col: 1, type: 'ice' },
      { row: 3, col: 6, type: 'ice' },
      { row: 4, col: 1, type: 'ice' },
      { row: 4, col: 6, type: 'ice' },
      { row: 2, col: 3, type: 'block' },
      { row: 5, col: 4, type: 'block' }
    ],
    hint: '横向和纵向炸弹一起使用效果惊人！'
  },
  {
    id: 18,
    name: '彩虹之路',
    description: '让彩虹照亮你的道路！',
    gridSize: 8,
    moves: 26,
    targetScore: 11000,
    tasks: [
      { type: 'fruits', fruitId: 0, count: 20 },
      { type: 'fruits', fruitId: 3, count: 20 },
      { type: 'score', score: 8000 }
    ],
    obstacles: [
      { row: 0, col: 3, type: 'ice2' },
      { row: 0, col: 4, type: 'ice2' },
      { row: 7, col: 3, type: 'ice2' },
      { row: 7, col: 4, type: 'ice2' },
      { row: 2, col: 2, type: 'chain' },
      { row: 2, col: 5, type: 'chain' },
      { row: 5, col: 2, type: 'chain' },
      { row: 5, col: 5, type: 'chain' },
      { row: 3, col: 0, type: 'block' },
      { row: 3, col: 7, type: 'block' },
      { row: 4, col: 0, type: 'block' },
      { row: 4, col: 7, type: 'block' }
    ],
    hint: '尽量制造五消来获得彩虹道具！'
  },
  {
    id: 19,
    name: '水果大师',
    description: '你已经是半个大师了！',
    gridSize: 8,
    moves: 30,
    targetScore: 13000,
    tasks: [
      { type: 'fruits', fruitId: 1, count: 25 },
      { type: 'fruits', fruitId: 4, count: 25 },
      { type: 'obstacles', obstacleType: 'chain', count: 15 }
    ],
    obstacles: [
      { row: 0, col: 1, type: 'chain' },
      { row: 0, col: 6, type: 'chain' },
      { row: 7, col: 1, type: 'chain' },
      { row: 7, col: 6, type: 'chain' },
      { row: 1, col: 3, type: 'ice2' },
      { row: 1, col: 4, type: 'ice2' },
      { row: 6, col: 3, type: 'ice2' },
      { row: 6, col: 4, type: 'ice2' },
      { row: 2, col: 1, type: 'chain' },
      { row: 2, col: 6, type: 'chain' },
      { row: 5, col: 1, type: 'chain' },
      { row: 5, col: 6, type: 'chain' },
      { row: 3, col: 3, type: 'chain' },
      { row: 3, col: 4, type: 'chain' },
      { row: 4, col: 3, type: 'chain' },
      { row: 4, col: 4, type: 'chain' },
      { row: 3, col: 0, type: 'block' },
      { row: 4, col: 7, type: 'block' }
    ],
    hint: '包装炸弹可以同时消除多个障碍！'
  },
  {
    id: 20,
    name: '巅峰对决',
    description: '最后的考验！',
    gridSize: 8,
    moves: 35,
    targetScore: 15000,
    tasks: [
      { type: 'fruits', fruitId: 0, count: 20 },
      { type: 'fruits', fruitId: 2, count: 20 },
      { type: 'fruits', fruitId: 5, count: 20 },
      { type: 'obstacles', obstacleType: 'ice', count: 12 },
      { type: 'obstacles', obstacleType: 'chain', count: 10 }
    ],
    obstacles: [
      { row: 0, col: 0, type: 'ice2' },
      { row: 0, col: 7, type: 'ice2' },
      { row: 7, col: 0, type: 'ice2' },
      { row: 7, col: 7, type: 'ice2' },
      { row: 1, col: 3, type: 'chain' },
      { row: 1, col: 4, type: 'chain' },
      { row: 6, col: 3, type: 'chain' },
      { row: 6, col: 4, type: 'chain' },
      { row: 2, col: 2, type: 'ice' },
      { row: 2, col: 5, type: 'ice' },
      { row: 5, col: 2, type: 'ice' },
      { row: 5, col: 5, type: 'ice' },
      { row: 3, col: 1, type: 'chain' },
      { row: 3, col: 6, type: 'chain' },
      { row: 4, col: 1, type: 'chain' },
      { row: 4, col: 6, type: 'chain' },
      { row: 3, col: 3, type: 'block' },
      { row: 3, col: 4, type: 'block' },
      { row: 4, col: 3, type: 'block' },
      { row: 4, col: 4, type: 'block' }
    ],
    hint: '这是最后的考验！加油！'
  },

  // === 第21-25关：大师级 ===
  {
    id: 21,
    name: '水果传奇',
    description: '成为真正的传奇！',
    gridSize: 8,
    moves: 32,
    targetScore: 18000,
    tasks: [
      { type: 'fruits', fruitId: 0, count: 30 },
      { type: 'fruits', fruitId: 1, count: 30 },
      { type: 'obstacles', obstacleType: 'ice', count: 15 }
    ],
    obstacles: [
      { row: 0, col: 2, type: 'ice2' },
      { row: 0, col: 5, type: 'ice2' },
      { row: 7, col: 2, type: 'ice2' },
      { row: 7, col: 5, type: 'ice2' },
      { row: 1, col: 0, type: 'chain' },
      { row: 1, col: 7, type: 'chain' },
      { row: 6, col: 0, type: 'chain' },
      { row: 6, col: 7, type: 'chain' },
      { row: 2, col: 3, type: 'ice2' },
      { row: 2, col: 4, type: 'ice2' },
      { row: 5, col: 3, type: 'ice2' },
      { row: 5, col: 4, type: 'ice2' },
      { row: 3, col: 1, type: 'chain' },
      { row: 3, col: 6, type: 'chain' },
      { row: 4, col: 1, type: 'chain' },
      { row: 4, col: 6, type: 'chain' },
      { row: 0, col: 3, type: 'block' },
      { row: 7, col: 4, type: 'block' }
    ],
    hint: '传奇需要更多的智慧！'
  },
  {
    id: 22,
    name: '冰雪奇缘',
    description: '在冰雪中寻找希望！',
    gridSize: 8,
    moves: 35,
    targetScore: 20000,
    tasks: [
      { type: 'fruits', fruitId: 3, count: 35 },
      { type: 'obstacles', obstacleType: 'ice', count: 20 }
    ],
    obstacles: [
      { row: 0, col: 1, type: 'ice2' },
      { row: 0, col: 2, type: 'ice2' },
      { row: 0, col: 5, type: 'ice2' },
      { row: 0, col: 6, type: 'ice2' },
      { row: 7, col: 1, type: 'ice2' },
      { row: 7, col: 2, type: 'ice2' },
      { row: 7, col: 5, type: 'ice2' },
      { row: 7, col: 6, type: 'ice2' },
      { row: 1, col: 0, type: 'ice' },
      { row: 1, col: 7, type: 'ice' },
      { row: 6, col: 0, type: 'ice' },
      { row: 6, col: 7, type: 'ice' },
      { row: 2, col: 3, type: 'ice2' },
      { row: 2, col: 4, type: 'ice2' },
      { row: 5, col: 3, type: 'ice2' },
      { row: 5, col: 4, type: 'ice2' },
      { row: 3, col: 2, type: 'chain' },
      { row: 3, col: 5, type: 'chain' },
      { row: 4, col: 2, type: 'chain' },
      { row: 4, col: 5, type: 'chain' },
      { row: 3, col: 3, type: 'block' },
      { row: 4, col: 4, type: 'block' }
    ],
    hint: '耐心是成功的关键！'
  },
  {
    id: 23,
    name: '水果风暴',
    description: '风暴来了！稳住！',
    gridSize: 8,
    moves: 38,
    targetScore: 23000,
    tasks: [
      { type: 'fruits', fruitId: 4, count: 40 },
      { type: 'obstacles', obstacleType: 'chain', count: 18 }
    ],
    obstacles: [
      { row: 0, col: 0, type: 'chain' },
      { row: 0, col: 7, type: 'chain' },
      { row: 7, col: 0, type: 'chain' },
      { row: 7, col: 7, type: 'chain' },
      { row: 1, col: 1, type: 'chain' },
      { row: 1, col: 6, type: 'chain' },
      { row: 6, col: 1, type: 'chain' },
      { row: 6, col: 6, type: 'chain' },
      { row: 2, col: 2, type: 'ice2' },
      { row: 2, col: 5, type: 'ice2' },
      { row: 5, col: 2, type: 'ice2' },
      { row: 5, col: 5, type: 'ice2' },
      { row: 3, col: 3, type: 'chain' },
      { row: 3, col: 4, type: 'chain' },
      { row: 4, col: 3, type: 'chain' },
      { row: 4, col: 4, type: 'chain' },
      { row: 0, col: 3, type: 'block' },
      { row: 0, col: 4, type: 'block' },
      { row: 7, col: 3, type: 'block' },
      { row: 7, col: 4, type: 'block' }
    ],
    hint: '利用道具的连锁反应！'
  },
  {
    id: 24,
    name: '水果至尊',
    description: '你即将成为至尊！',
    gridSize: 8,
    moves: 40,
    targetScore: 26000,
    tasks: [
      { type: 'fruits', fruitId: 2, count: 35 },
      { type: 'fruits', fruitId: 5, count: 35 },
      { type: 'obstacles', obstacleType: 'ice', count: 18 },
      { type: 'obstacles', obstacleType: 'chain', count: 15 }
    ],
    obstacles: [
      { row: 0, col: 0, type: 'ice2' },
      { row: 0, col: 7, type: 'ice2' },
      { row: 7, col: 0, type: 'ice2' },
      { row: 7, col: 7, type: 'ice2' },
      { row: 0, col: 3, type: 'chain' },
      { row: 0, col: 4, type: 'chain' },
      { row: 7, col: 3, type: 'chain' },
      { row: 7, col: 4, type: 'chain' },
      { row: 1, col: 1, type: 'chain' },
      { row: 1, col: 6, type: 'chain' },
      { row: 6, col: 1, type: 'chain' },
      { row: 6, col: 6, type: 'chain' },
      { row: 2, col: 3, type: 'ice2' },
      { row: 2, col: 4, type: 'ice2' },
      { row: 5, col: 3, type: 'ice2' },
      { row: 5, col: 4, type: 'ice2' },
      { row: 3, col: 0, type: 'block' },
      { row: 3, col: 7, type: 'block' },
      { row: 4, col: 0, type: 'block' },
      { row: 4, col: 7, type: 'block' },
      { row: 3, col: 2, type: 'ice' },
      { row: 3, col: 5, type: 'ice' },
      { row: 4, col: 2, type: 'ice' },
      { row: 4, col: 5, type: 'ice' },
      { row: 2, col: 1, type: 'chain' },
      { row: 5, col: 6, type: 'chain' }
    ],
    hint: '至尊需要最完美的策略！'
  },
  {
    id: 25,
    name: '水果之王',
    description: '恭喜！你已经是水果之王了！',
    gridSize: 8,
    moves: 45,
    targetScore: 30000,
    tasks: [
      { type: 'fruits', fruitId: 0, count: 30 },
      { type: 'fruits', fruitId: 1, count: 30 },
      { type: 'fruits', fruitId: 2, count: 30 },
      { type: 'fruits', fruitId: 3, count: 30 },
      { type: 'fruits', fruitId: 4, count: 30 },
      { type: 'fruits', fruitId: 5, count: 30 },
      { type: 'obstacles', obstacleType: 'ice', count: 25 },
      { type: 'obstacles', obstacleType: 'chain', count: 20 }
    ],
    obstacles: [
      { row: 0, col: 0, type: 'ice2' },
      { row: 0, col: 7, type: 'ice2' },
      { row: 7, col: 0, type: 'ice2' },
      { row: 7, col: 7, type: 'ice2' },
      { row: 0, col: 2, type: 'chain' },
      { row: 0, col: 5, type: 'chain' },
      { row: 7, col: 2, type: 'chain' },
      { row: 7, col: 5, type: 'chain' },
      { row: 1, col: 1, type: 'ice2' },
      { row: 1, col: 6, type: 'ice2' },
      { row: 6, col: 1, type: 'ice2' },
      { row: 6, col: 6, type: 'ice2' },
      { row: 1, col: 3, type: 'chain' },
      { row: 1, col: 4, type: 'chain' },
      { row: 6, col: 3, type: 'chain' },
      { row: 6, col: 4, type: 'chain' },
      { row: 2, col: 2, type: 'ice' },
      { row: 2, col: 5, type: 'ice' },
      { row: 5, col: 2, type: 'ice' },
      { row: 5, col: 5, type: 'ice' },
      { row: 3, col: 1, type: 'chain' },
      { row: 3, col: 6, type: 'chain' },
      { row: 4, col: 1, type: 'chain' },
      { row: 4, col: 6, type: 'chain' },
      { row: 3, col: 3, type: 'block' },
      { row: 3, col: 4, type: 'block' },
      { row: 4, col: 3, type: 'block' },
      { row: 4, col: 4, type: 'block' },
      { row: 2, col: 0, type: 'ice2' },
      { row: 2, col: 7, type: 'ice2' },
      { row: 5, col: 0, type: 'ice2' },
      { row: 5, col: 7, type: 'ice2' }
    ],
    hint: '这是最终关卡！成为水果之王吧！'
  }
]

// 关卡进度管理
export const getUnlockedLevels = () => {
  const saved = localStorage.getItem('unlockedLevels')
  return saved ? JSON.parse(saved) : [1]
}

export const unlockLevel = (levelId) => {
  const unlocked = getUnlockedLevels()
  if (!unlocked.includes(levelId) && levelId <= LEVELS.length) {
    unlocked.push(levelId)
    localStorage.setItem('unlockedLevels', JSON.stringify(unlocked))
  }
}

export const isLevelUnlocked = (levelId) => {
  return getUnlockedLevels().includes(levelId)
}

export const getLevelById = (id) => {
  return LEVELS.find(level => level.id === id)
}

// 音效管理 - 使用Web Audio API生成音效
// 单例模式确保全局共享静音状态

const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || window.webkitAudioContext)() : null
let backgroundInterval = null
let backgroundIndex = 0
let isMuted = false
let activeSources = []

// 生成音效
const playTone = (frequency, duration, type = 'sine', volume = 0.2) => {
  if (isMuted || !audioContext) return
  
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.value = frequency
  oscillator.type = type
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime)
  gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.02)
  gainNode.gain.linearRampToValueAtTime(volume * 0.8, audioContext.currentTime + duration * 0.5)
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)
  
  oscillator.start(audioContext.currentTime)
  
  const stopTime = audioContext.currentTime + duration
  oscillator.stop(stopTime)
  
  const sourceRef = { oscillator, gainNode, stopTime }
  activeSources.push(sourceRef)
  
  setTimeout(() => {
    const index = activeSources.indexOf(sourceRef)
    if (index > -1) {
      activeSources.splice(index, 1)
    }
  }, duration * 1000 + 100)
}

// 播放匹配音效
const playMatchSound = (matchCount) => {
  if (isMuted) return
  if (matchCount >= 5) {
    playTone(523.25, 0.12, 'sine', 0.25)
    setTimeout(() => { if (!isMuted) playTone(659.25, 0.12, 'sine', 0.25) }, 60)
    setTimeout(() => { if (!isMuted) playTone(880, 0.15, 'sine', 0.3) }, 120)
  } else if (matchCount >= 4) {
    playTone(440, 0.1, 'sine', 0.2)
    setTimeout(() => { if (!isMuted) playTone(523.25, 0.12, 'sine', 0.25) }, 50)
  } else {
    playTone(392, 0.1, 'sine', 0.18)
    setTimeout(() => { if (!isMuted) playTone(440, 0.1, 'sine', 0.2) }, 50)
  }
}

// 播放连锁反应音效
const playChainSound = () => {
  if (isMuted) return
  playTone(659.25, 0.08, 'sine', 0.2)
  setTimeout(() => { if (!isMuted) playTone(587.33, 0.08, 'sine', 0.18) }, 40)
  setTimeout(() => { if (!isMuted) playTone(523.25, 0.08, 'sine', 0.16) }, 80)
  setTimeout(() => { if (!isMuted) playTone(440, 0.1, 'sine', 0.14) }, 120)
}

// 播放交换音效
const playSwapSound = () => {
  if (isMuted) return
  playTone(523.25, 0.06, 'sine', 0.15)
  setTimeout(() => { if (!isMuted) playTone(587.33, 0.06, 'sine', 0.15) }, 40)
}

// 播放错误音效
const playErrorSound = () => {
  if (isMuted) return
  playTone(330, 0.1, 'triangle', 0.15)
  setTimeout(() => { if (!isMuted) playTone(293.66, 0.12, 'triangle', 0.12) }, 80)
}

// 播放游戏开始音效
const playGameStartSound = () => {
  if (isMuted) return
  playTone(392, 0.12, 'sine', 0.2)
  setTimeout(() => { if (!isMuted) playTone(493.88, 0.12, 'sine', 0.22) }, 100)
  setTimeout(() => { if (!isMuted) playTone(523.25, 0.15, 'sine', 0.25) }, 200)
  setTimeout(() => { if (!isMuted) playTone(659.25, 0.18, 'sine', 0.3) }, 300)
}

// 播放游戏结束音效
const playGameOverSound = () => {
  if (isMuted) return
  playTone(330, 0.15, 'sine', 0.2)
  setTimeout(() => { if (!isMuted) playTone(293.66, 0.15, 'sine', 0.18) }, 150)
  setTimeout(() => { if (!isMuted) playTone(261.63, 0.2, 'sine', 0.15) }, 300)
}

// 播放水果掉落音效
const playDropSound = () => {
  if (isMuted) return
  
  const baseFreq = 500 + Math.random() * 200
  
  playTone(baseFreq, 0.06, 'sine', 0.06)
  
  setTimeout(() => {
    if (!isMuted) playTone(baseFreq * 0.9, 0.04, 'sine', 0.04)
  }, 40)
  
  setTimeout(() => {
    if (!isMuted) playTone(baseFreq * 0.8, 0.03, 'sine', 0.03)
  }, 80)
}

// 背景音乐和弦序列
const backgroundChords = [
  [261.63, 329.63, 392.00],
  [293.66, 369.99, 440.00],
  [329.63, 415.30, 493.88],
  [349.23, 440.00, 523.25],
  [392.00, 493.88, 587.33],
  [440.00, 554.37, 659.25],
  [261.63, 329.63, 392.00],
  [349.23, 440.00, 523.25],
]

// 播放单个和弦
const playChord = (chord, volume = 0.02) => {
  if (isMuted) return
  chord.forEach(freq => {
    playTone(freq, 2, 'sine', volume)
  })
}

// 开始背景音乐
const startBackgroundMusic = () => {
  if (!audioContext) return
  if (backgroundInterval) return
  if (isMuted) return
  
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }
  
  playChord(backgroundChords[0], 0.015)
  
  backgroundInterval = setInterval(() => {
    if (isMuted) return
    const chord = backgroundChords[backgroundIndex % backgroundChords.length]
    playChord(chord, 0.012)
    backgroundIndex++
  }, 3000)
}

// 停止所有音效
const stopAllSounds = () => {
  activeSources.forEach(source => {
    try {
      source.gainNode.gain.cancelScheduledValues(audioContext.currentTime)
      source.gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      source.oscillator.stop(audioContext.currentTime)
    } catch (e) {
      // 忽略已停止的源
    }
  })
  activeSources = []
}

// 停止背景音乐
const stopBackgroundMusic = () => {
  if (backgroundInterval) {
    clearInterval(backgroundInterval)
    backgroundInterval = null
    backgroundIndex = 0
  }
  stopAllSounds()
}

// 切换静音状态
const toggleMute = () => {
  isMuted = !isMuted
  
  if (isMuted) {
    stopBackgroundMusic()
    if (audioContext && audioContext.state === 'running') {
      audioContext.suspend()
    }
  } else {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume()
    }
    startBackgroundMusic()
  }
  
  return isMuted
}

// 获取静音状态
const getMuted = () => {
  return isMuted
}

// 解锁音频上下文（需要用户交互）
const unlockAudio = () => {
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume()
  }
}

// 监听用户交互以解锁音频
if (typeof window !== 'undefined') {
  window.addEventListener('click', unlockAudio, { once: true })
  window.addEventListener('touchstart', unlockAudio, { once: true })
}

export const useSoundEffects = () => ({
  playMatchSound,
  playChainSound,
  playSwapSound,
  playErrorSound,
  playGameStartSound,
  playGameOverSound,
  playDropSound,
  startBackgroundMusic,
  stopBackgroundMusic,
  toggleMute,
  getMuted
})
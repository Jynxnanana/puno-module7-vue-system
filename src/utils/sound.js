// Synthesized sound effects using Web Audio API — walang kailangang mp3 files
function playTone(freq, duration, type = 'sine', volume = 0.15) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch (e) { /* ignore if audio unsupported */ }
}

export function playClick() {
  playTone(600, 0.08, 'square', 0.06)
}
export function playSuccess() {
  playTone(523, 0.12, 'sine', 0.12)
  setTimeout(() => playTone(784, 0.15, 'sine', 0.12), 100)
}
export function playDelete() {
  playTone(300, 0.15, 'sawtooth', 0.08)
  setTimeout(() => playTone(180, 0.2, 'sawtooth', 0.08), 80)
}
// All audio is generated locally. No recordings, remote files, or audio autoplay.
export class BattleAudio {
  constructor() { this.context = null; this.muted = false; this.beat = 0; this.nextBeat = 0; }
  async unlock() {
    try {
      if (!this.context) {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.master = this.context.createGain(); this.master.gain.value = this.muted ? 0 : .45; this.master.connect(this.context.destination);
        this.timer = setInterval(() => this.music(), 100);
      }
      if (this.context.state === 'suspended') await this.context.resume();
    } catch { /* Play remains available on browsers without Web Audio. */ }
  }
  mute(value) { this.muted = value; if (this.master) this.master.gain.setTargetAtTime(value ? 0 : .45, this.context.currentTime, .08); }
  tone(freq, length, gain = .2, type = 'sine', delay = 0, end = freq) {
    const c = this.context; if (!c || c.state !== 'running') return;
    const t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(freq, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, end), t + length);
    g.gain.setValueAtTime(.001, t); g.gain.exponentialRampToValueAtTime(gain, t + .009); g.gain.exponentialRampToValueAtTime(.001, t + length); o.connect(g); g.connect(this.master); o.start(t); o.stop(t + length + .01);
  }
  noise(length, gain, frequency = 500) {
    const c = this.context; if (!c || c.state !== 'running') return;
    const b = c.createBuffer(1, c.sampleRate * length, c.sampleRate), data = b.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 2;
    const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = b; f.type = 'lowpass'; f.frequency.value = frequency; g.gain.value = gain; s.connect(f); f.connect(g); g.connect(this.master); s.start();
  }
  tap(n) { this.tone(320 + Math.min(n, 60) * 12, .055, .055, 'triangle'); }
  choose(guard) { this.tone(guard ? 330 : 220, .14, .14, 'triangle', 0, guard ? 660 : 440); }
  impact(guard, charged) { this.noise(charged ? .6 : .32, guard ? .5 : .85, guard ? 2500 : 700); this.tone(charged ? 160 : 110, .4, .7, 'sine', 0, 28); if (guard) this.tone(780, .5, .15, 'triangle', 0, 300); }
  finish(outcome) { const notes = outcome === 'victory' ? [261.63, 329.63, 392, 523.25] : outcome === 'draw' ? [330, 293.66, 261.63] : [293.66, 261.63, 196]; notes.forEach((f, i) => this.tone(f, .6, .18, 'triangle', i * .15)); }
  music() {
    const c = this.context; if (!c || c.state !== 'running' || document.hidden || this.muted) return;
    if (c.currentTime < this.nextBeat) return;
    this.nextBeat = c.currentTime + .375; const n = this.beat++ % 32;
    if (n % 4 === 0) this.tone(90, .23, .14, 'sine', 0, 38);
    if (n % 4 === 2) this.noise(.09, .1, 1300);
    if (n % 2 === 0) this.tone([130.81, 155.56, 174.61, 196][Math.floor(n / 8)], .25, .055, 'triangle');
    if (n % 2 === 1) this.tone([523.25, 622.25, 783.99, 698.46, 622.25, 523.25, 466.16, 392][Math.floor(n / 2) % 8], .18, .025, 'sine');
  }
}

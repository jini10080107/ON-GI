// Web Audio API Procedural Ambient Sound Engine
// Reliable, zero-network, peaceful sound generator

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentSound: string | null = null;
  private activeNodes: { stop: () => void }[] = [];
  private masterGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  public stop() {
    this.activeNodes.forEach(node => {
      try {
        node.stop();
      } catch {
        // ignore already stopped
      }
    });
    this.activeNodes = [];
    this.currentSound = null;
  }

  public isPlaying(soundType: string): boolean {
    return this.currentSound === soundType;
  }

  public play(soundType: 'rain' | 'breeze' | 'crackle' | 'cricket') {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.currentSound === soundType) {
      this.stop();
      return;
    }

    this.stop();
    this.currentSound = soundType;

    switch (soundType) {
      case 'rain':
        this.playRain();
        break;
      case 'breeze':
        this.playBreeze();
        break;
      case 'crackle':
        this.playCrackle();
        break;
      case 'cricket':
        this.playCrickets();
        break;
    }
  }

  private playRain() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Buffer for pink/brown noise
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);

    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(0.35, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);

    whiteNoise.start();
    this.activeNodes.push({
      stop: () => {
        try {
          whiteNoise.stop();
          whiteNoise.disconnect();
        } catch {}
      }
    });
  }

  private playBreeze() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, ctx.currentTime);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);

    // LFO for swaying wind
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.18, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(180, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    source.start();
    lfo.start();

    this.activeNodes.push({
      stop: () => {
        try {
          source.stop();
          lfo.stop();
          source.disconnect();
          lfo.disconnect();
        } catch {}
      }
    });
  }

  private playCrackle() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Gentle low fire hum
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(65, ctx.currentTime);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.12, ctx.currentTime);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start();

    // Crackle noise generator
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Occasional random pop
      if (Math.random() < 0.003) {
        output[i] = (Math.random() * 2 - 1) * 0.8;
      } else {
        output[i] = (Math.random() * 2 - 1) * 0.02;
      }
    }

    const crackleSource = ctx.createBufferSource();
    crackleSource.buffer = noiseBuffer;
    crackleSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    const crackleGain = ctx.createGain();
    crackleGain.gain.setValueAtTime(0.45, ctx.currentTime);

    crackleSource.connect(filter);
    filter.connect(crackleGain);
    crackleGain.connect(this.masterGain);

    crackleSource.start();

    this.activeNodes.push({
      stop: () => {
        try {
          osc.stop();
          crackleSource.stop();
          osc.disconnect();
          crackleSource.disconnect();
        } catch {}
      }
    });
  }

  private playCrickets() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(4500, ctx.currentTime);

    // Modulation for chirp pulses
    const mod = ctx.createOscillator();
    mod.type = 'sawtooth';
    mod.frequency.setValueAtTime(4, ctx.currentTime);

    const modGain = ctx.createGain();
    modGain.gain.setValueAtTime(0.08, ctx.currentTime);

    const ampGain = ctx.createGain();
    ampGain.gain.setValueAtTime(0.04, ctx.currentTime);

    mod.connect(modGain.gain);
    osc1.connect(modGain);
    modGain.connect(ampGain);
    ampGain.connect(this.masterGain);

    osc1.start();
    mod.start();

    this.activeNodes.push({
      stop: () => {
        try {
          osc1.stop();
          mod.stop();
          osc1.disconnect();
          mod.disconnect();
        } catch {}
      }
    });
  }
}

export const soundEngine = new SoundEngine();

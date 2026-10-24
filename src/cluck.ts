// Tiny WebAudio "cot-cot" so the prototype needs no audio files
export function cluck(): void {
  const ctx = new AudioContext();
  [0, 0.18, 0.36, 0.7].forEach((t, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(i === 3 ? 900 : 600, ctx.currentTime + t);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + t + 0.12);
    gain.gain.setValueAtTime(0.15, ctx.currentTime + t);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.14);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime + t);
    osc.stop(ctx.currentTime + t + 0.15);
  });
}

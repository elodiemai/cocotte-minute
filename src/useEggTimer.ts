import { useEffect, useEffectEvent, useRef, useState } from 'react';

export type Phase = 'idle' | 'running' | 'paused' | 'done';

export function formatTime(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// Countdown state machine: idle → running ⇄ paused → done.
// Ticks against an end timestamp so the timer doesn't drift.
export function useEggTimer(totalMs: number, onFinish?: () => void) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [remainingMs, setRemainingMs] = useState(totalMs);
  const endsAt = useRef(0);
  // Always calls the latest onFinish without restarting the interval
  const finish = useEffectEvent(() => onFinish?.());

  useEffect(() => {
    if (phase !== 'running') return;
    const id = setInterval(() => {
      const left = endsAt.current - Date.now();
      if (left <= 0) {
        setRemainingMs(0);
        setPhase('done');
        finish();
      } else {
        setRemainingMs(left);
      }
    }, 250);
    return () => clearInterval(id);
  }, [phase]);

  return {
    phase,
    // While idle, follow the selected egg directly
    remainingMs: phase === 'idle' ? totalMs : remainingMs,
    start() {
      const from = phase === 'paused' ? remainingMs : totalMs;
      endsAt.current = Date.now() + from;
      setRemainingMs(from);
      setPhase('running');
    },
    pause() {
      setRemainingMs(endsAt.current - Date.now());
      setPhase('paused');
    },
    reset() {
      setPhase('idle');
    },
  };
}

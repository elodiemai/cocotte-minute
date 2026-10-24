import { formatTime } from '../useEggTimer';

const RADIUS = 52;
const RING_LENGTH = 2 * Math.PI * RADIUS;

interface TimerRingProps {
  remainingMs: number;
  totalMs: number;
  status: string;
}

export default function TimerRing({ remainingMs, totalMs, status }: TimerRingProps) {
  const elapsed = 1 - remainingMs / totalMs;

  return (
    <div className="ring">
      <svg viewBox="0 0 120 120">
        <circle className="track" cx="60" cy="60" r={RADIUS} />
        <circle
          className="progress"
          cx="60"
          cy="60"
          r={RADIUS}
          strokeDasharray={RING_LENGTH}
          strokeDashoffset={RING_LENGTH * (1 - elapsed)}
        />
      </svg>
      <div className="readout">
        <span className="time">{formatTime(remainingMs)}</span>
        <span className="status">{status}</span>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { EGG_TYPES, SIZE_OFFSETS } from './eggs';
import { useEggTimer, formatTime, type Phase } from './useEggTimer';
import { cluck } from './cluck';
import Chicken from './components/Chicken';
import Pot from './components/Pot';
import EggPicker from './components/EggPicker';
import SizePicker from './components/SizePicker';
import TimerRing from './components/TimerRing';

const STATUS: Record<Exclude<Phase, 'running'>, string> = {
  idle: 'Prêt ?',
  paused: 'En pause',
  done: 'Cot cot ! Prêt !',
};

const START_LABEL: Record<Phase, string> = {
  idle: "C'est parti !",
  running: 'Pause',
  paused: 'Reprendre',
  done: 'Encore un !',
};

function onFinish() {
  cluck();
  navigator.vibrate?.([200, 100, 200]);
}

export default function App() {
  const [egg, setEgg] = useState(EGG_TYPES[1]);
  const [size, setSize] = useState(SIZE_OFFSETS[1]);
  const totalMs = (egg.seconds + size.seconds) * 1000;
  const { phase, remainingMs, start, pause, reset } = useEggTimer(totalMs, onFinish);

  const locked = phase === 'running' || phase === 'paused';
  // The mascot gets more agitated as the end approaches
  const panic = phase === 'running' && remainingMs < 30_000;

  useEffect(() => {
    document.body.dataset.phase = phase;
    document.title =
      phase === 'running' ? `${formatTime(remainingMs)} · ${egg.name}` : 'Cocotte Minute';
  }, [phase, remainingMs, egg]);

  function pick<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      if (phase === 'done') reset();
    };
  }

  function onStartClick() {
    if (phase === 'running') pause();
    else if (phase === 'done') reset();
    else start();
  }

  return (
    <main className="app">
      <header>
        <h1>Cocotte Minute</h1>
        <p className="subtitle">Choisis ton œuf, Cocotte s'occupe du reste.</p>
      </header>

      <section className="stage" aria-hidden="true">
        <Chicken phase={phase} panic={panic} />
        <Pot boiling={phase === 'running'} />
      </section>

      <section className="picker" aria-label="Type de cuisson">
        <EggPicker eggs={EGG_TYPES} selected={egg} onSelect={pick(setEgg)} disabled={locked} />
        <SizePicker sizes={SIZE_OFFSETS} selected={size} onSelect={pick(setSize)} disabled={locked} />
      </section>

      <section className="timer">
        <TimerRing
          remainingMs={remainingMs}
          totalMs={totalMs}
          status={phase === 'running' ? egg.name : STATUS[phase]}
        />
        <div className="controls">
          <button className="btn primary" onClick={onStartClick}>
            {START_LABEL[phase]}
          </button>
          {phase !== 'idle' && (
            <button className="btn ghost" onClick={reset}>
              Recommencer
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

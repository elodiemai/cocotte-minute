import { useEffect, useState } from 'react';
import { EGG_TYPES, SIZE_OFFSETS } from './eggs';
import { getSteps, type Stage, type Step } from './steps';
import { useEggTimer, formatTime } from './useEggTimer';
import { rollCreature, shinyChance, type Hatch } from './creatures';
import { cluck } from './cluck';
import { TEST_MODE, TEST_SECONDS } from './testMode';
import Scene from './scene/Scene';
import EggPicker from './components/EggPicker';
import SizePicker from './components/SizePicker';
import Steps from './components/Steps';
import TimerRing from './components/TimerRing';

function cookingLine(progress: number): string {
  if (progress > 0.85) return 'Ça craque ! Il va éclore !';
  if (progress > 0.5) return 'Il bouge ! Continue de le câliner.';
  return "Touche l'œuf pour le rassurer !";
}

function revealLine({ species, shiny }: Hatch): string {
  return shiny ? `${species.quip} Et il brille !` : species.quip;
}

export default function App() {
  const [egg, setEgg] = useState(EGG_TYPES[1]);
  const [size, setSize] = useState(SIZE_OFFSETS[1]);
  const [cuddles, setCuddles] = useState(0);
  const [hatch, setHatch] = useState<Hatch | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const totalMs = (TEST_MODE ? TEST_SECONDS : egg.seconds + size.seconds) * 1000;
  // The timer rang: decide what hatches (the scene plays the sequence)
  const { phase, remainingMs, start, pause, reset } = useEggTimer(totalMs, () => {
    cluck();
    navigator.vibrate?.([200, 100, 200]);
    const result = rollCreature(egg.id, cuddles);
    setHatch(result);
  });

  const stage: Stage = phase === 'idle' ? 'prep' : phase === 'done' ? 'serve' : 'cook';
  const steps = getSteps(egg, totalMs);
  const progress = 1 - remainingMs / totalMs;

  useEffect(() => {
    document.body.dataset.phase = phase;
    document.title =
      phase === 'running' ? `${formatTime(remainingMs)} · ${egg.name}` : 'Cocotte Minute';
  }, [phase, remainingMs, egg]);

  const speech = {
    prep: "Cot ! Mets ton œuf dans l'eau frémissante, puis lance le minuteur.",
    cook: phase === 'paused' ? 'On fait une pause…' : cookingLine(progress),
    serve: revealed && hatch ? revealLine(hatch) : "Quoi ? L'œuf éclot !",
  }[stage];

  function pick<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      if (phase === 'done') newEgg();
    };
  }

  function newEgg() {
    reset();
    setHatch(null);
    setRevealed(false);
    setCuddles(0);
    setCheckedSteps([]);
  }

  function toggleStep(index: number) {
    setCheckedSteps((list) => (list.includes(index) ? list.filter((i) => i !== index) : [...list, index]));
  }

  function onStartClick() {
    if (phase === 'running') pause();
    else if (phase === 'done') newEgg();
    else {
      // The picker disappears: scroll back up to the egg (phones)
      if (phase === 'idle') window.scrollTo({ top: 0, behavior: 'smooth' });
      start();
    }
  }

  // The timer lives in the cooking step; the "another egg" button in the last one
  function stepExtra(step: Step) {
    if (step.stage === 'cook' && stage === 'prep') {
      return (
        <button className="btn primary" onClick={onStartClick}>
          C'est parti !
        </button>
      );
    }
    if (step.stage === 'cook' && stage === 'cook') {
      return (
        <div className="timer">
          <TimerRing
            remainingMs={remainingMs}
            totalMs={totalMs}
            status={phase === 'paused' ? 'En pause' : egg.name}
          />
          <div className="controls">
            <button className="btn primary" onClick={onStartClick}>
              {phase === 'running' ? 'Pause' : 'Reprendre'}
            </button>
            <button className="btn ghost" onClick={newEgg}>
              Recommencer
            </button>
          </div>
        </div>
      );
    }
    if (step.stage === 'serve' && stage === 'serve') {
      return (
        <button className="btn primary" onClick={newEgg}>
          Encore un !
        </button>
      );
    }
    return null;
  }

  return (
    <main className={`app stage-${stage}`}>
      <header>
        <h1>Cocotte Minute</h1>
        <p className="subtitle">Choisis ton œuf… et découvre ce qui en sort !</p>
        {TEST_MODE && <p className="test-badge">Mode test : cuisson de {TEST_SECONDS} s</p>}
      </header>

      <section className="play" aria-label="Le jeu">
        <h2>Qu'est-ce qui va éclore ?</h2>
        <Scene
          mood={revealed ? 'done' : 'idle'}
          heat={stage === 'serve' ? null : 'simmer'}
          flame={stage === 'serve' ? 0 : 0.7}
          speech={speech}
          incubating={stage === 'cook' || stage === 'serve'}
          progress={progress}
          cuddles={cuddles}
          onCuddle={() => phase === 'running' && setCuddles((n) => n + 1)}
          hatch={hatch}
          revealed={revealed}
          onRevealed={() => setRevealed(true)}
          clock={stage === 'cook' ? (phase === 'paused' ? `${formatTime(remainingMs)} · pause` : formatTime(remainingMs)) : null}
        />

        {stage === 'cook' && (
          <div className="care">
            <p>
              <strong>Câlins : {cuddles} ❤</strong>
            </p>
            <p>
              Chance d'un œuf chromatique ✨ : <strong>{Math.round(shinyChance(cuddles) * 100)} %</strong>
            </p>
          </div>
        )}

        {stage === 'serve' && hatch && revealed && (
          <div className={`reveal${hatch.shiny ? ' shiny' : ''}`} aria-live="polite">
            <p className="reveal-kicker">Ton œuf {egg.name.toLowerCase()} a éclos !</p>
            <p className="reveal-name">
              <span aria-hidden="true">{hatch.species.emoji}</span> {hatch.species.name}
              {hatch.shiny && ' chromatique ✨'}
            </p>
            {hatch.surprise && <p className="reveal-note">Surprise : ce n'est pas l'œuf habituel pour lui !</p>}
          </div>
        )}
      </section>

      {stage === 'prep' && (
        <section className="picker" aria-label="Type de cuisson">
          <h2 className="picker-title">Choisis ton œuf</h2>
          <EggPicker eggs={EGG_TYPES} selected={egg} onSelect={pick(setEgg)} disabled={false} />
          <SizePicker sizes={SIZE_OFFSETS} selected={size} onSelect={pick(setSize)} disabled={false} />
        </section>
      )}

      <Steps steps={steps} current={stage} checked={checkedSteps} onToggle={toggleStep} renderExtra={stepExtra} />

    </main>
  );
}

import type { ReactNode } from 'react';
import { STAGES, type Stage, type Step } from '../steps';

export type StepState = 'done' | 'active' | 'todo';

interface StepsProps {
  steps: Step[];
  current: Stage;
  /** Indexes of the steps the cook ticked off */
  checked: number[];
  onToggle: (index: number) => void;
  /** Extra content shown inside a step's card (e.g. the timer in the cooking step) */
  renderExtra?: (step: Step, state: StepState) => ReactNode;
}

// A checklist: a step is done when ticked, or when the cooking has moved past it.
// The cooking step is driven by the timer, so it can't be ticked by hand.
export default function Steps({ steps, current, checked, onToggle, renderExtra }: StepsProps) {
  const currentIndex = STAGES.indexOf(current);
  const stageIndex = (step: Step) => STAGES.indexOf(step.stage);
  const passed = (step: Step) => stageIndex(step) < currentIndex;
  const isDone = (step: Step, i: number) => passed(step) || checked.includes(i);

  // First unfinished step of the current stage; once the prep is ticked off,
  // the cooking step (with its start button) takes over
  let activeIndex = steps.findIndex((step, i) => !isDone(step, i) && stageIndex(step) <= currentIndex);
  if (activeIndex === -1 && current === 'prep') activeIndex = steps.findIndex((step) => step.stage === 'cook');

  return (
    <section className="steps">
      <h2>Les étapes</h2>
      <p className="steps-hint">Touche une étape pour la cocher quand c'est fait.</p>
      <ol>
        {steps.map((step, i) => {
          const done = isDone(step, i);
          const state: StepState = done ? 'done' : i === activeIndex ? 'active' : 'todo';
          const extra = renderExtra?.(step, state);
          return (
            <li key={step.title} className={state} aria-current={state === 'active' ? 'step' : undefined}>
              <button
                type="button"
                role="checkbox"
                aria-checked={done}
                disabled={passed(step) || step.stage === 'cook'}
                onClick={() => onToggle(i)}
              >
                <span className="num">{i + 1}</span>
                <span className="step-text">
                  <strong>{step.title}</strong>
                  <span className="step-detail">{step.detail}</span>
                </span>
                {/* Visible checkbox; the timer ticks the cooking step itself */}
                <span className={`tick${step.stage === 'cook' && !done ? ' auto' : ''}`} aria-hidden="true">
                  {done ? '✓' : step.stage === 'cook' ? '⏱' : ''}
                </span>
              </button>
              {extra && <div className="step-extra">{extra}</div>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

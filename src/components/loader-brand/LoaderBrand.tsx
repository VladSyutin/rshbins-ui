import { useEffect, useMemo, useState, type CSSProperties, type HTMLAttributes } from 'react';
import './LoaderBrand.scss';
import { runtimeTokenData } from '../../theme/runtimeTokens';

export type LoaderBrandLogoStep = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type LoaderBrandTextStep = '1' | '2' | '3' | '4';

export interface LoaderBrandProps extends HTMLAttributes<HTMLDivElement> {
  autoPlay?: boolean;
  logoStep?: LoaderBrandLogoStep;
  textStep?: LoaderBrandTextStep;
}

type LoaderBrandBarStyle = CSSProperties & {
  '--rshb-loader-brand-bar-height': string;
  '--rshb-loader-brand-bar-color': string;
};

const LOGO_STEP_SEQUENCE: LoaderBrandLogoStep[] = ['1', '2', '3', '4', '5', '6', '7', '8'];
const TEXT_STEP_SEQUENCE: LoaderBrandTextStep[] = ['1', '2', '3', '4'];
const LOGO_IDLE_DELAY_MS = 1;
const LOGO_PAUSE_DELAY_MS = 500;
const LOGO_PAUSE_STEPS = new Set<LoaderBrandLogoStep>(['4', '8']);

const TEXT_STEP_LABELS: Record<LoaderBrandTextStep, string> = {
  '1': 'Загружаем',
  '2': 'Скоро всё загрузится',
  '3': 'Ещё чуть-чуть',
  '4': 'Сейчас всё покажем'
};

const LOGO_BAR_HEIGHTS: Record<LoaderBrandLogoStep, [number, number, number]> = {
  '1': [80, 64, 64],
  '2': [64, 80, 64],
  '3': [64, 64, 80],
  '4': [64, 64, 64],
  '5': [64, 64, 80],
  '6': [64, 80, 64],
  '7': [80, 64, 64],
  '8': [64, 64, 64]
};

const LOGO_BAR_COLORS = [
  'var(--color-logo-line-1)',
  'var(--color-logo-line-2)',
  'var(--color-logo-line-3)'
] as const;

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function parseDurationMs(value: string): number {
  const duration = Number.parseFloat(value);

  if (!Number.isFinite(duration)) {
    return 0;
  }

  if (value.endsWith('ms')) {
    return duration;
  }

  if (value.endsWith('s')) {
    return duration * 1000;
  }

  return duration;
}

function getNextLogoStep(step: LoaderBrandLogoStep): LoaderBrandLogoStep {
  const currentIndex = LOGO_STEP_SEQUENCE.indexOf(step);
  return LOGO_STEP_SEQUENCE[(currentIndex + 1) % LOGO_STEP_SEQUENCE.length];
}

function getNextTextStep(step: LoaderBrandTextStep): LoaderBrandTextStep {
  const currentIndex = TEXT_STEP_SEQUENCE.indexOf(step);
  return TEXT_STEP_SEQUENCE[(currentIndex + 1) % TEXT_STEP_SEQUENCE.length];
}

const loaderBrandMotion = runtimeTokenData.semantic.motion.loaderbrand;
const LOGO_TRANSITION_DURATION_MS = parseDurationMs(loaderBrandMotion.logo.duration);
const TEXT_TRANSITION_DURATION_MS = parseDurationMs(loaderBrandMotion.text.duration);
const TEXT_STEP_DELAY_MS = parseDurationMs(loaderBrandMotion.text.delay);
const LONGEST_TEXT_LABEL = TEXT_STEP_SEQUENCE.reduce<string>(
  (longest, step) => (TEXT_STEP_LABELS[step].length > longest.length ? TEXT_STEP_LABELS[step] : longest),
  TEXT_STEP_LABELS[TEXT_STEP_SEQUENCE[0]]
);

/**
 * Brand loader with animated logo bars and rotating helper text.
 */
export function LoaderBrand({
  autoPlay = true,
  className,
  logoStep,
  textStep,
  ...props
}: LoaderBrandProps) {
  const isLogoControlled = logoStep !== undefined;
  const isTextControlled = textStep !== undefined;
  const [internalLogoStep, setInternalLogoStep] = useState<LoaderBrandLogoStep>('1');
  const [internalTextStep, setInternalTextStep] = useState<LoaderBrandTextStep>('1');
  const resolvedLogoStep = logoStep ?? internalLogoStep;
  const resolvedTextStep = textStep ?? internalTextStep;

  const [visibleTextStep, setVisibleTextStep] = useState<LoaderBrandTextStep>(resolvedTextStep);
  const [exitingTextStep, setExitingTextStep] = useState<LoaderBrandTextStep | null>(null);

  useEffect(() => {
    if (!autoPlay || isLogoControlled) {
      return;
    }

    const holdDelay = LOGO_PAUSE_STEPS.has(resolvedLogoStep) ? LOGO_PAUSE_DELAY_MS : LOGO_IDLE_DELAY_MS;
    const timeoutId = window.setTimeout(() => {
      setInternalLogoStep(getNextLogoStep(resolvedLogoStep));
    }, holdDelay + LOGO_TRANSITION_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [autoPlay, isLogoControlled, resolvedLogoStep]);

  useEffect(() => {
    if (!autoPlay || isTextControlled) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setInternalTextStep((currentStep) => getNextTextStep(currentStep));
    }, TEXT_STEP_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [autoPlay, isTextControlled, resolvedTextStep]);

  useEffect(() => {
    if (resolvedTextStep === visibleTextStep) {
      return;
    }

    setExitingTextStep(visibleTextStep);
    setVisibleTextStep(resolvedTextStep);

    const timeoutId = window.setTimeout(() => {
      setExitingTextStep(null);
    }, TEXT_TRANSITION_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [resolvedTextStep, visibleTextStep]);

  const barHeights = LOGO_BAR_HEIGHTS[resolvedLogoStep];
  const barStyles = useMemo(
    () =>
      barHeights.map(
        (height, index) =>
          ({
            '--rshb-loader-brand-bar-height': `${height}px`,
            '--rshb-loader-brand-bar-color': LOGO_BAR_COLORS[index]
          }) as LoaderBrandBarStyle
      ),
    [barHeights]
  );

  return (
    <div
      {...props}
      className={joinClassNames('rshb-loader-brand', className)}
      data-logo-step={resolvedLogoStep}
      data-text-step={resolvedTextStep}
    >
      <div aria-hidden="true" className="rshb-loader-brand__logo">
        {barStyles.map((style, index) => (
          <span
            key={LOGO_BAR_COLORS[index]}
            className="rshb-loader-brand__bar"
            style={style}
          />
        ))}
      </div>

      <span className="rshb-loader-brand__text" role="status">
        <span aria-hidden="true" className="rshb-loader-brand__text-sizer">
          {LONGEST_TEXT_LABEL}
        </span>
        {exitingTextStep ? (
          <span
            aria-hidden="true"
            className="rshb-loader-brand__text-layer"
            data-phase="exiting"
            key={`exit-${exitingTextStep}`}
          >
            {TEXT_STEP_LABELS[exitingTextStep]}
          </span>
        ) : null}
        <span
          className="rshb-loader-brand__text-layer"
          data-phase="entering"
          key={`enter-${visibleTextStep}`}
        >
          {TEXT_STEP_LABELS[visibleTextStep]}
        </span>
      </span>
    </div>
  );
}

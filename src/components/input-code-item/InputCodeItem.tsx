import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode
} from 'react';
import './InputCodeItem.scss';
import circleExclamationFillIconUrl from '../../../icons/circle-exclamation-fill.svg';

const CODE_INPUT_LENGTH = 4;

export type InputCodeItemPreviewState = 'default' | 'typing' | 'loading' | 'error';
export type InputCodeItemCompletionBehavior = 'error' | 'reset';

type CodeInputCellVisualState = 'default' | 'focused' | 'loading';

type PreviewSnapshot = {
  activeIndex: number | null;
  digits: string[];
  isLoading: boolean;
  showError: boolean;
};

type InputCodeItemIconStyle = CSSProperties & {
  '--rshb-input-code-item-icon-url': string;
};

export interface InputCodeItemProps {
  autoFocus?: boolean;
  className?: string;
  completionBehavior?: InputCodeItemCompletionBehavior;
  complementaryIcon?: ReactNode;
  complementaryText?: ReactNode;
  loadingDuration?: number;
  onComplete?: (code: string) => void;
  onValueChange?: (code: string) => void;
  previewState?: InputCodeItemPreviewState;
  showComplementaryIcon?: boolean;
  showComplementaryText?: boolean;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function createEmptyDigits(): string[] {
  return Array.from({ length: CODE_INPUT_LENGTH }, () => '');
}

function getPreviewSnapshot(previewState: InputCodeItemPreviewState): PreviewSnapshot {
  if (previewState === 'typing') {
    return {
      digits: ['0', '', '', ''],
      activeIndex: 1,
      isLoading: false,
      showError: false
    };
  }

  if (previewState === 'loading') {
    return {
      digits: ['0', '0', '0', '0'],
      activeIndex: null,
      isLoading: true,
      showError: false
    };
  }

  if (previewState === 'error') {
    return {
      digits: createEmptyDigits(),
      activeIndex: 0,
      isLoading: false,
      showError: true
    };
  }

  return {
    digits: createEmptyDigits(),
    activeIndex: 0,
    isLoading: false,
    showError: false
  };
}

function resolveCellVisualState({
  activeIndex,
  index,
  isLoading
}: {
  activeIndex: number | null;
  index: number;
  isLoading: boolean;
}): CodeInputCellVisualState {
  if (isLoading) {
    return 'loading';
  }

  if (activeIndex === index) {
    return 'focused';
  }

  return 'default';
}

/**
 * OTP-style input translated from Figma with the same interaction flow as the provided prototype:
 * focus first cell, fill one digit at a time, show a loading state on completion, then reset into an error state.
 */
export function InputCodeItem({
  autoFocus = true,
  className,
  completionBehavior = 'error',
  complementaryIcon,
  complementaryText = 'Вспомогательный текст',
  loadingDuration = 3000,
  onComplete,
  onValueChange,
  previewState,
  showComplementaryIcon = false,
  showComplementaryText = true
}: InputCodeItemProps) {
  const [digits, setDigits] = useState<string[]>(() => createEmptyDigits());
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [focusRequestKey, setFocusRequestKey] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const autofocusTimerRef = useRef<number | null>(null);
  const loadingTimerRef = useRef<number | null>(null);
  const completionLockedRef = useRef(false);
  const pendingFocusIndexRef = useRef<number | null>(null);
  const descriptionId = useId();
  const isInteractive = previewState === undefined;
  const defaultComplementaryIconStyle = {
    '--rshb-input-code-item-icon-url': `url("${circleExclamationFillIconUrl}")`
  } as InputCodeItemIconStyle;

  function focusCell(index: number) {
    pendingFocusIndexRef.current = index;
    setFocusRequestKey((value) => value + 1);
  }

  function clearAutofocusTimer() {
    if (autofocusTimerRef.current === null) {
      return;
    }

    window.clearTimeout(autofocusTimerRef.current);
    autofocusTimerRef.current = null;
  }

  function clearLoadingTimer() {
    if (loadingTimerRef.current === null) {
      return;
    }

    window.clearTimeout(loadingTimerRef.current);
    loadingTimerRef.current = null;
  }

  function blurInputs() {
    inputRefs.current.forEach((input) => {
      input?.blur();
    });
  }

  function updateDigits(nextDigits: string[]) {
    setDigits(nextDigits);
    onValueChange?.(nextDigits.join(''));
  }

  useEffect(() => {
    return () => {
      clearAutofocusTimer();
      clearLoadingTimer();
    };
  }, []);

  useEffect(() => {
    if (!isInteractive || !autoFocus) {
      return;
    }

    clearAutofocusTimer();
    autofocusTimerRef.current = window.setTimeout(() => {
      autofocusTimerRef.current = null;
      focusCell(0);
    }, 50);

    return clearAutofocusTimer;
  }, [autoFocus, isInteractive]);

  useEffect(() => {
    if (!isInteractive || isLoading || pendingFocusIndexRef.current === null) {
      return;
    }

    const focusIndex = pendingFocusIndexRef.current;
    pendingFocusIndexRef.current = null;
    inputRefs.current[focusIndex]?.focus();
  }, [activeIndex, focusRequestKey, isInteractive, isLoading]);

  useEffect(() => {
    if (!isInteractive || isLoading || digits.some((digit) => digit === '')) {
      return;
    }

    completionLockedRef.current = false;
  }, [digits, isInteractive, isLoading]);

  useEffect(() => {
    if (
      !isInteractive ||
      isLoading ||
      completionLockedRef.current ||
      digits.some((digit) => digit === '')
    ) {
      return;
    }

    completionLockedRef.current = true;
    const code = digits.join('');
    onComplete?.(code);
    setIsLoading(true);
    setActiveIndex(null);
    blurInputs();
    clearLoadingTimer();
    loadingTimerRef.current = window.setTimeout(() => {
      loadingTimerRef.current = null;
      setDigits(createEmptyDigits());
      onValueChange?.('');
      setIsLoading(false);
      setShowError(completionBehavior === 'error');
      setActiveIndex(0);
      focusCell(0);
    }, loadingDuration);
  }, [completionBehavior, digits, isInteractive, isLoading, loadingDuration, onComplete, onValueChange]);

  function handleDigitEntry(index: number, digit: string) {
    if (!isInteractive || isLoading) {
      return;
    }

    if (index === 0 && showError) {
      setShowError(false);
    }

    const nextDigits = [...digits];
    nextDigits[index] = digit;
    updateDigits(nextDigits);

    if (index < CODE_INPUT_LENGTH - 1) {
      const nextIndex = index + 1;
      setActiveIndex(nextIndex);
      focusCell(nextIndex);
      return;
    }

    setActiveIndex(index);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (!isInteractive || isLoading) {
      return;
    }

    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      handleDigitEntry(index, event.key);
      return;
    }

    if (event.key !== 'Backspace') {
      return;
    }

    event.preventDefault();
    const nextDigits = [...digits];

    if (nextDigits[index] !== '') {
      nextDigits[index] = '';
      updateDigits(nextDigits);
      setActiveIndex(index);
      return;
    }

    if (index === 0) {
      return;
    }

    const previousIndex = index - 1;
    nextDigits[previousIndex] = '';
    updateDigits(nextDigits);
    setActiveIndex(previousIndex);
    focusCell(previousIndex);
  }

  function handleChange(index: number, value: string) {
    if (!isInteractive || isLoading) {
      return;
    }

    const nextDigit = value.replace(/\D/g, '').slice(-1);

    if (!nextDigit) {
      return;
    }

    handleDigitEntry(index, nextDigit);
  }

  function handleContainerBlur(nextFocusedNode: EventTarget | null) {
    if (!isInteractive) {
      return;
    }

    if (containerRef.current?.contains(nextFocusedNode as Node | null)) {
      return;
    }

    setActiveIndex(null);
  }

  const previewSnapshot = previewState ? getPreviewSnapshot(previewState) : null;
  const resolvedDigits = previewSnapshot?.digits ?? digits;
  const resolvedActiveIndex = previewSnapshot?.activeIndex ?? activeIndex;
  const resolvedIsLoading = previewSnapshot?.isLoading ?? isLoading;
  const resolvedShowError = previewSnapshot?.showError ?? showError;
  const resolvedVisualState =
    previewState ??
    (resolvedIsLoading ? 'loading' : resolvedShowError ? 'error' : resolvedDigits.some(Boolean) ? 'typing' : 'default');

  return (
    <div
      className={joinClassNames('rshb-input-code-item', className)}
      data-state={resolvedVisualState}
      data-with-error={resolvedShowError ? 'true' : 'false'}
    >
      <div
        ref={containerRef}
        aria-describedby={resolvedShowError && showComplementaryText ? descriptionId : undefined}
        aria-label="Код подтверждения"
        className="rshb-input-code-item__cells"
        onBlur={(event) => handleContainerBlur(event.relatedTarget)}
        role="group"
      >
        {resolvedDigits.map((digit, index) => {
          const isEmpty = digit === '';
          const visualState = resolveCellVisualState({
            activeIndex: resolvedActiveIndex,
            index,
            isLoading: resolvedIsLoading
          });

          return (
            <div
              className="rshb-input-code-item__cell"
              data-has-value={isEmpty ? 'false' : 'true'}
              data-state={visualState}
              key={index}
              onClick={() => {
                if (!isInteractive || resolvedIsLoading) {
                  return;
                }

                inputRefs.current[index]?.focus();
              }}
            >
              {!isEmpty ? (
                <span className="rshb-input-code-item__digit" aria-hidden="true">
                  {digit}
                </span>
              ) : null}

              {visualState === 'focused' && isEmpty ? (
                <span aria-hidden="true" className="rshb-input-code-item__cursor" />
              ) : null}

              <input
                aria-describedby={resolvedShowError && showComplementaryText ? descriptionId : undefined}
                aria-invalid={resolvedShowError || undefined}
                aria-label={`Цифра ${index + 1}`}
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                className="rshb-input-code-item__native-input"
                disabled={!isInteractive || resolvedIsLoading}
                inputMode="numeric"
                onChange={(event) => {
                  handleChange(index, event.currentTarget.value);
                  event.currentTarget.value = '';
                }}
                onFocus={() => {
                  if (!isInteractive || resolvedIsLoading) {
                    return;
                  }

                  setActiveIndex(index);
                }}
                onKeyDown={(event) => handleKeyDown(index, event)}
                pattern="[0-9]*"
                ref={(input) => {
                  inputRefs.current[index] = input;
                }}
                type="text"
              />
            </div>
          );
        })}
      </div>

      {resolvedShowError && (showComplementaryText || showComplementaryIcon) ? (
        <div
          className="rshb-input-code-item__complementary"
          id={showComplementaryText ? descriptionId : undefined}
        >
          {showComplementaryIcon ? (
            complementaryIcon ? (
              <span aria-hidden="true" className="rshb-input-code-item__complementary-icon">
                {complementaryIcon}
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="rshb-input-code-item__complementary-icon rshb-input-code-item__complementary-icon--default"
                style={defaultComplementaryIconStyle}
              />
            )
          ) : null}

          {showComplementaryText ? (
            <span className="rshb-input-code-item__complementary-text">{complementaryText}</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

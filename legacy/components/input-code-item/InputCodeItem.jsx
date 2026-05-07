import React, { useEffect, useId, useRef, useState } from 'react';
import './styles.css';

var CODE_INPUT_LENGTH = 4;

var circleExclamationFillIconUrl = new URL(
  '../../../icons/circle-exclamation-fill.svg',
  import.meta.url
).href;

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

function createEmptyDigits() {
  return Array.from({ length: CODE_INPUT_LENGTH }, function () {
    return '';
  });
}

function getPreviewSnapshot(previewState) {
  if (previewState === 'typing') {
    return { digits: ['0', '', '', ''], activeIndex: 1, isLoading: false, showError: false };
  }
  if (previewState === 'loading') {
    return { digits: ['0', '0', '0', '0'], activeIndex: null, isLoading: true, showError: false };
  }
  if (previewState === 'error') {
    return { digits: createEmptyDigits(), activeIndex: 0, isLoading: false, showError: true };
  }
  return { digits: createEmptyDigits(), activeIndex: 0, isLoading: false, showError: false };
}

function resolveCellVisualState(_ref) {
  var activeIndex = _ref.activeIndex;
  var index = _ref.index;
  var isLoading = _ref.isLoading;

  if (isLoading) return 'loading';
  if (activeIndex === index) return 'focused';
  return 'default';
}

export default function InputCodeItem(props) {
  var autoFocus = props.autoFocus != null ? props.autoFocus : true;
  var className = props.className;
  var completionBehavior = props.completionBehavior || 'error';
  var complementaryIcon = props.complementaryIcon;
  var complementaryText =
    props.complementaryText != null ? props.complementaryText : 'Вспомогательный текст';
  var loadingDuration = props.loadingDuration != null ? props.loadingDuration : 3000;
  var onComplete = props.onComplete;
  var onValueChange = props.onValueChange;
  var previewState = props.previewState;
  var showComplementaryIcon =
    props.showComplementaryIcon != null ? props.showComplementaryIcon : false;
  var showComplementaryText =
    props.showComplementaryText != null ? props.showComplementaryText : true;

  var _useState = useState(function () {
    return createEmptyDigits();
  });
  var digits = _useState[0];
  var setDigits = _useState[1];

  var _useState2 = useState(0);
  var activeIndex = _useState2[0];
  var setActiveIndex = _useState2[1];

  var _useState3 = useState(false);
  var isLoading = _useState3[0];
  var setIsLoading = _useState3[1];

  var _useState4 = useState(false);
  var showError = _useState4[0];
  var setShowError = _useState4[1];

  var _useState5 = useState(0);
  var focusRequestKey = _useState5[0];
  var setFocusRequestKey = _useState5[1];

  var containerRef = useRef(null);
  var inputRefs = useRef([]);
  var autofocusTimerRef = useRef(null);
  var loadingTimerRef = useRef(null);
  var completionLockedRef = useRef(false);
  var pendingFocusIndexRef = useRef(null);
  var descriptionId = useId();
  var isInteractive = previewState === undefined;

  var defaultComplementaryIconStyle = {
    '--rshb-legacy-input-code-item-icon-url': 'url("' + circleExclamationFillIconUrl + '")'
  };

  function focusCell(index) {
    pendingFocusIndexRef.current = index;
    setFocusRequestKey(function (v) {
      return v + 1;
    });
  }

  function clearAutofocusTimer() {
    if (autofocusTimerRef.current === null) return;
    window.clearTimeout(autofocusTimerRef.current);
    autofocusTimerRef.current = null;
  }

  function clearLoadingTimer() {
    if (loadingTimerRef.current === null) return;
    window.clearTimeout(loadingTimerRef.current);
    loadingTimerRef.current = null;
  }

  function blurInputs() {
    inputRefs.current.forEach(function (input) {
      if (input) input.blur();
    });
  }

  function updateDigits(nextDigits) {
    setDigits(nextDigits);
    if (onValueChange) onValueChange(nextDigits.join(''));
  }

  useEffect(function () {
    return function () {
      clearAutofocusTimer();
      clearLoadingTimer();
    };
  }, []);

  useEffect(
    function () {
      if (!isInteractive || !autoFocus) return;
      clearAutofocusTimer();
      autofocusTimerRef.current = window.setTimeout(function () {
        autofocusTimerRef.current = null;
        focusCell(0);
      }, 50);
      return clearAutofocusTimer;
    },
    [autoFocus, isInteractive]
  );

  useEffect(
    function () {
      if (!isInteractive || isLoading || pendingFocusIndexRef.current === null) return;
      var focusIndex = pendingFocusIndexRef.current;
      pendingFocusIndexRef.current = null;
      if (inputRefs.current[focusIndex]) inputRefs.current[focusIndex].focus();
    },
    [activeIndex, focusRequestKey, isInteractive, isLoading]
  );

  useEffect(
    function () {
      if (!isInteractive || isLoading || digits.some(function (d) { return d === ''; })) return;
      completionLockedRef.current = false;
    },
    [digits, isInteractive, isLoading]
  );

  useEffect(
    function () {
      if (
        !isInteractive ||
        isLoading ||
        completionLockedRef.current ||
        digits.some(function (d) { return d === ''; })
      ) return;

      completionLockedRef.current = true;
      var code = digits.join('');
      if (onComplete) onComplete(code);
      setIsLoading(true);
      setActiveIndex(null);
      blurInputs();
      clearLoadingTimer();
      loadingTimerRef.current = window.setTimeout(function () {
        loadingTimerRef.current = null;
        setDigits(createEmptyDigits());
        if (onValueChange) onValueChange('');
        setIsLoading(false);
        setShowError(completionBehavior === 'error');
        setActiveIndex(0);
        focusCell(0);
      }, loadingDuration);
    },
    [completionBehavior, digits, isInteractive, isLoading, loadingDuration, onComplete, onValueChange]
  );

  function handleDigitEntry(index, digit) {
    if (!isInteractive || isLoading) return;
    if (index === 0 && showError) setShowError(false);
    var nextDigits = digits.slice();
    nextDigits[index] = digit;
    updateDigits(nextDigits);
    if (index < CODE_INPUT_LENGTH - 1) {
      var nextIndex = index + 1;
      setActiveIndex(nextIndex);
      focusCell(nextIndex);
      return;
    }
    setActiveIndex(index);
  }

  function handleKeyDown(index, event) {
    if (!isInteractive || isLoading) return;
    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      handleDigitEntry(index, event.key);
      return;
    }
    if (event.key !== 'Backspace') return;
    event.preventDefault();
    var nextDigits = digits.slice();
    if (nextDigits[index] !== '') {
      nextDigits[index] = '';
      updateDigits(nextDigits);
      setActiveIndex(index);
      return;
    }
    if (index === 0) return;
    var previousIndex = index - 1;
    nextDigits[previousIndex] = '';
    updateDigits(nextDigits);
    setActiveIndex(previousIndex);
    focusCell(previousIndex);
  }

  function handleChange(index, value) {
    if (!isInteractive || isLoading) return;
    var nextDigit = value.replace(/\D/g, '').slice(-1);
    if (!nextDigit) return;
    handleDigitEntry(index, nextDigit);
  }

  function handleContainerBlur(nextFocusedNode) {
    if (!isInteractive) return;
    if (containerRef.current && containerRef.current.contains(nextFocusedNode)) return;
    setActiveIndex(null);
  }

  var previewSnapshot = previewState ? getPreviewSnapshot(previewState) : null;
  var resolvedDigits = previewSnapshot ? previewSnapshot.digits : digits;
  var resolvedActiveIndex = previewSnapshot ? previewSnapshot.activeIndex : activeIndex;
  var resolvedIsLoading = previewSnapshot ? previewSnapshot.isLoading : isLoading;
  var resolvedShowError = previewSnapshot ? previewSnapshot.showError : showError;
  var resolvedVisualState =
    previewState != null
      ? previewState
      : resolvedIsLoading
      ? 'loading'
      : resolvedShowError
      ? 'error'
      : resolvedDigits.some(Boolean)
      ? 'typing'
      : 'default';

  return (
    <div
      className={joinClassNames('rshb-legacy-input-code-item', className)}
      data-state={resolvedVisualState}
      data-with-error={resolvedShowError ? 'true' : 'false'}
    >
      <div
        ref={containerRef}
        aria-describedby={resolvedShowError && showComplementaryText ? descriptionId : undefined}
        aria-label="Код подтверждения"
        className="rshb-legacy-input-code-item__cells"
        onBlur={function (event) {
          handleContainerBlur(event.relatedTarget);
        }}
        role="group"
      >
        {resolvedDigits.map(function (digit, index) {
          var isEmpty = digit === '';
          var visualState = resolveCellVisualState({
            activeIndex: resolvedActiveIndex,
            index: index,
            isLoading: resolvedIsLoading
          });

          return (
            <div
              className="rshb-legacy-input-code-item__cell"
              data-has-value={isEmpty ? 'false' : 'true'}
              data-state={visualState}
              key={index}
              onClick={function () {
                if (!isInteractive || resolvedIsLoading) return;
                if (inputRefs.current[index]) inputRefs.current[index].focus();
              }}
            >
              {!isEmpty ? (
                <span className="rshb-legacy-input-code-item__digit" aria-hidden="true">
                  {digit}
                </span>
              ) : null}

              {visualState === 'focused' && isEmpty ? (
                <span aria-hidden="true" className="rshb-legacy-input-code-item__cursor" />
              ) : null}

              <input
                aria-describedby={
                  resolvedShowError && showComplementaryText ? descriptionId : undefined
                }
                aria-invalid={resolvedShowError || undefined}
                aria-label={'Цифра ' + (index + 1)}
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                className="rshb-legacy-input-code-item__native-input"
                disabled={!isInteractive || resolvedIsLoading}
                inputMode="numeric"
                onChange={function (event) {
                  handleChange(index, event.currentTarget.value);
                  event.currentTarget.value = '';
                }}
                onFocus={function () {
                  if (!isInteractive || resolvedIsLoading) return;
                  setActiveIndex(index);
                }}
                onKeyDown={function (event) {
                  handleKeyDown(index, event);
                }}
                pattern="[0-9]*"
                ref={function (input) {
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
          className="rshb-legacy-input-code-item__complementary"
          id={showComplementaryText ? descriptionId : undefined}
        >
          {showComplementaryIcon ? (
            complementaryIcon ? (
              <span aria-hidden="true" className="rshb-legacy-input-code-item__complementary-icon">
                {complementaryIcon}
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="rshb-legacy-input-code-item__complementary-icon rshb-legacy-input-code-item__complementary-icon--default"
                style={defaultComplementaryIconStyle}
              />
            )
          ) : null}

          {showComplementaryText ? (
            <span className="rshb-legacy-input-code-item__complementary-text">
              {complementaryText}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

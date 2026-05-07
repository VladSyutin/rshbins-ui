import React, { useEffect, useMemo, useState } from 'react';
import './styles.css';

var LOGO_STEP_SEQUENCE = ['1', '2', '3', '4', '5', '6', '7', '8'];
var TEXT_STEP_SEQUENCE = ['1', '2', '3', '4'];
var LOGO_IDLE_DELAY_MS = 1;
var LOGO_PAUSE_DELAY_MS = 500;
var LOGO_PAUSE_STEPS = new Set(['4', '8']);
var LOGO_TRANSITION_DURATION_MS = 200;
var TEXT_TRANSITION_DURATION_MS = 300;
var TEXT_STEP_DELAY_MS = 5000;

var TEXT_STEP_LABELS = {
  '1': 'Загружаем',
  '2': 'Скоро всё загрузится',
  '3': 'Ещё чуть-чуть',
  '4': 'Сейчас всё покажем'
};

var LOGO_BAR_HEIGHTS = {
  '1': [80, 64, 64],
  '2': [64, 80, 64],
  '3': [64, 64, 80],
  '4': [64, 64, 64],
  '5': [64, 64, 80],
  '6': [64, 80, 64],
  '7': [80, 64, 64],
  '8': [64, 64, 64]
};

var LOGO_BAR_COLORS = [
  'var(--legacy-color-logo-line-1)',
  'var(--legacy-color-logo-line-2)',
  'var(--legacy-color-logo-line-3)'
];

var LONGEST_TEXT_LABEL = TEXT_STEP_SEQUENCE.reduce(function (longest, step) {
  return TEXT_STEP_LABELS[step].length > longest.length ? TEXT_STEP_LABELS[step] : longest;
}, TEXT_STEP_LABELS[TEXT_STEP_SEQUENCE[0]]);

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

function getNextLogoStep(step) {
  var currentIndex = LOGO_STEP_SEQUENCE.indexOf(step);
  return LOGO_STEP_SEQUENCE[(currentIndex + 1) % LOGO_STEP_SEQUENCE.length];
}

function getNextTextStep(step) {
  var currentIndex = TEXT_STEP_SEQUENCE.indexOf(step);
  return TEXT_STEP_SEQUENCE[(currentIndex + 1) % TEXT_STEP_SEQUENCE.length];
}

export default function LoaderBrand(props) {
  var autoPlay = props.autoPlay != null ? props.autoPlay : true;
  var className = props.className;
  var logoStep = props.logoStep;
  var textStep = props.textStep;

  var isLogoControlled = logoStep !== undefined;
  var isTextControlled = textStep !== undefined;

  var internalLogoStepState = useState('1');
  var internalLogoStep = internalLogoStepState[0];
  var setInternalLogoStep = internalLogoStepState[1];

  var internalTextStepState = useState('1');
  var internalTextStep = internalTextStepState[0];
  var setInternalTextStep = internalTextStepState[1];

  var resolvedLogoStep = logoStep != null ? logoStep : internalLogoStep;
  var resolvedTextStep = textStep != null ? textStep : internalTextStep;

  var visibleTextStepState = useState(resolvedTextStep);
  var visibleTextStep = visibleTextStepState[0];
  var setVisibleTextStep = visibleTextStepState[1];

  var exitingTextStepState = useState(null);
  var exitingTextStep = exitingTextStepState[0];
  var setExitingTextStep = exitingTextStepState[1];

  useEffect(function () {
    if (!autoPlay || isLogoControlled) {
      return;
    }

    var holdDelay = LOGO_PAUSE_STEPS.has(resolvedLogoStep) ? LOGO_PAUSE_DELAY_MS : LOGO_IDLE_DELAY_MS;
    var timeoutId = window.setTimeout(function () {
      setInternalLogoStep(getNextLogoStep(resolvedLogoStep));
    }, holdDelay + LOGO_TRANSITION_DURATION_MS);

    return function () {
      window.clearTimeout(timeoutId);
    };
  }, [autoPlay, isLogoControlled, resolvedLogoStep]);

  useEffect(function () {
    if (!autoPlay || isTextControlled) {
      return;
    }

    var timeoutId = window.setTimeout(function () {
      setInternalTextStep(function (currentStep) {
        return getNextTextStep(currentStep);
      });
    }, TEXT_STEP_DELAY_MS);

    return function () {
      window.clearTimeout(timeoutId);
    };
  }, [autoPlay, isTextControlled, resolvedTextStep]);

  useEffect(function () {
    if (resolvedTextStep === visibleTextStep) {
      return;
    }

    setExitingTextStep(visibleTextStep);
    setVisibleTextStep(resolvedTextStep);

    var timeoutId = window.setTimeout(function () {
      setExitingTextStep(null);
    }, TEXT_TRANSITION_DURATION_MS);

    return function () {
      window.clearTimeout(timeoutId);
    };
  }, [resolvedTextStep, visibleTextStep]);

  var barHeights = LOGO_BAR_HEIGHTS[resolvedLogoStep];
  var barStyles = useMemo(function () {
    return barHeights.map(function (height, index) {
      return {
        '--rshb-legacy-loader-brand-bar-height': height + 'px',
        '--rshb-legacy-loader-brand-bar-color': LOGO_BAR_COLORS[index]
      };
    });
  }, [barHeights]);

  var restProps = Object.assign({}, props);
  delete restProps.autoPlay;
  delete restProps.className;
  delete restProps.logoStep;
  delete restProps.textStep;

  return React.createElement(
    'div',
    Object.assign({}, restProps, {
      className: joinClassNames('rshb-legacy-loader-brand', className),
      'data-logo-step': resolvedLogoStep,
      'data-text-step': resolvedTextStep
    }),
    React.createElement(
      'div',
      { 'aria-hidden': 'true', className: 'rshb-legacy-loader-brand__logo' },
      barStyles.map(function (style, index) {
        return React.createElement('span', {
          key: LOGO_BAR_COLORS[index],
          className: 'rshb-legacy-loader-brand__bar',
          style: style
        });
      })
    ),
    React.createElement(
      'span',
      { className: 'rshb-legacy-loader-brand__text', role: 'status' },
      React.createElement(
        'span',
        { 'aria-hidden': 'true', className: 'rshb-legacy-loader-brand__text-sizer' },
        LONGEST_TEXT_LABEL
      ),
      exitingTextStep
        ? React.createElement(
            'span',
            {
              'aria-hidden': 'true',
              className: 'rshb-legacy-loader-brand__text-layer',
              'data-phase': 'exiting',
              key: 'exit-' + exitingTextStep
            },
            TEXT_STEP_LABELS[exitingTextStep]
          )
        : null,
      React.createElement(
        'span',
        {
          className: 'rshb-legacy-loader-brand__text-layer',
          'data-phase': 'entering',
          key: 'enter-' + visibleTextStep
        },
        TEXT_STEP_LABELS[visibleTextStep]
      )
    )
  );
}

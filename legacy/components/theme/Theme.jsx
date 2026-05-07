import React, { useEffect, useState } from 'react';
import './styles.css';

var DEFAULT_STORAGE_KEY = 'rshbins-ui-theme';

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

function getDocumentMode() {
  if (typeof document === 'undefined') {
    return undefined;
  }
  if (document.documentElement.classList.contains('theme-dark')) {
    return 'dark';
  }
  if (document.documentElement.classList.contains('theme-light')) {
    return 'light';
  }
  return undefined;
}

function getStoredMode(storageKey) {
  if (typeof window === 'undefined') {
    return undefined;
  }
  var storedMode = window.localStorage.getItem(storageKey);
  return storedMode === 'dark' || storedMode === 'light' ? storedMode : undefined;
}

function getPreferredMode() {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyDocumentTheme(mode) {
  if (typeof document === 'undefined') {
    return;
  }
  document.documentElement.classList.toggle('theme-light', mode === 'light');
  document.documentElement.classList.toggle('theme-dark', mode === 'dark');
  document.documentElement.style.colorScheme = mode;
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M8 13.5C11.0376 13.5 13.5 11.0376 13.5 8C13.5 5.76929 12.172 3.84875 10.2634 2.98585C10.5758 3.67628 10.75 4.44295 10.75 5.25C10.75 8.28757 8.28757 10.75 5.25 10.75C4.44295 10.75 3.67628 10.5758 2.98585 10.2635C3.84875 12.172 5.76929 13.5 8 13.5ZM1.04463 8.79483C1.43927 12.2866 4.40276 15 8 15C11.866 15 15 11.866 15 8C15 4.40276 12.2866 1.43927 8.79483 1.04463C8.7947 1.04461 8.79457 1.0446 8.79444 1.04458C8.78525 1.04355 8.77605 1.04253 8.76685 1.04152C8.51501 1.01408 8.25915 1 8 1C7.47268 1 7.41006 1.84189 7.81457 2.18019C7.87808 2.2333 7.93992 2.28836 8 2.34525C8.04957 2.39219 8.09794 2.4404 8.14505 2.4898C8.14899 2.49393 8.15291 2.49805 8.15683 2.50219C8.83447 3.21881 9.25 4.18588 9.25 5.25C9.25 7.45914 7.45914 9.25 5.25 9.25C4.18588 9.25 3.21881 8.83447 2.50219 8.15683C2.49805 8.15291 2.49393 8.14899 2.4898 8.14505C2.4404 8.09794 2.39219 8.04957 2.34525 8C2.28836 7.93992 2.2333 7.87809 2.18019 7.81457C1.84189 7.41007 1 7.47268 1 8C1 8.25915 1.01408 8.51501 1.04152 8.76685C1.04253 8.77605 1.04355 8.78525 1.04458 8.79444C1.0446 8.79457 1.04461 8.7947 1.04463 8.79483Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M8 3C7.58579 3 7.25 2.66421 7.25 2.25V0.75C7.25 0.335786 7.58579 0 8 0C8.41421 0 8.75 0.335786 8.75 0.75V2.25C8.75 2.66421 8.41421 3 8 3ZM8 10.5C9.38071 10.5 10.5 9.38071 10.5 8C10.5 6.61929 9.38071 5.5 8 5.5C6.61929 5.5 5.5 6.61929 5.5 8C5.5 9.38071 6.61929 10.5 8 10.5ZM8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12ZM7.25 15.25C7.25 15.6642 7.58579 16 8 16C8.41421 16 8.75 15.6642 8.75 15.25V13.75C8.75 13.3358 8.41421 13 8 13C7.58579 13 7.25 13.3358 7.25 13.75V15.25ZM13 8C13 7.58579 13.3358 7.25 13.75 7.25H15.25C15.6642 7.25 16 7.58579 16 8C16 8.41421 15.6642 8.75 15.25 8.75H13.75C13.3358 8.75 13 8.41421 13 8ZM0.75 7.25C0.335787 7.25 0 7.58579 0 8C0 8.41421 0.335786 8.75 0.75 8.75H2.25C2.66421 8.75 3 8.41421 3 8C3 7.58579 2.66421 7.25 2.25 7.25H0.75ZM11.5356 4.46447C11.2427 4.17157 11.2427 3.6967 11.5356 3.40381L12.5962 2.34315C12.8891 2.05025 13.364 2.05025 13.6569 2.34315C13.9498 2.63604 13.9498 3.11091 13.6569 3.40381L12.5962 4.46447C12.3034 4.75736 11.8285 4.75736 11.5356 4.46447ZM2.3432 12.5962C2.05031 12.8891 2.05031 13.364 2.3432 13.6569C2.6361 13.9497 3.11097 13.9497 3.40387 13.6569L4.46453 12.5962C4.75742 12.3033 4.75742 11.8284 4.46453 11.5355C4.17163 11.2426 3.69676 11.2426 3.40387 11.5355L2.3432 12.5962ZM11.5356 11.5355C11.8285 11.2426 12.3034 11.2426 12.5962 11.5355L13.6569 12.5962C13.9498 12.8891 13.9498 13.364 13.6569 13.6569C13.364 13.9497 12.8891 13.9497 12.5962 13.6569L11.5356 12.5962C11.2427 12.3033 11.2427 11.8284 11.5356 11.5355ZM3.40387 2.34314C3.11097 2.05025 2.6361 2.05025 2.3432 2.34314C2.05031 2.63604 2.05031 3.11091 2.3432 3.4038L3.40387 4.46446C3.69676 4.75736 4.17163 4.75736 4.46453 4.46446C4.75742 4.17157 4.75742 3.6967 4.46453 3.4038L3.40387 2.34314Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default function Theme(props) {
  const {
    applyToDocument,
    className,
    defaultMode,
    disabled,
    mode,
    onClick,
    onModeChange,
    previewState,
    storageKey,
    type,
    ...rest
  } = props;

  const resolvedApplyToDocument = applyToDocument !== undefined ? applyToDocument : true;
  const resolvedDisabled = Boolean(disabled);
  const resolvedPreviewState = previewState || 'default';
  const resolvedStorageKey = storageKey || DEFAULT_STORAGE_KEY;
  const resolvedType = type || 'button';

  const isControlled = mode !== undefined;

  const internalModeState = useState(function () {
    return defaultMode || getStoredMode(resolvedStorageKey) || getDocumentMode() || getPreferredMode();
  });
  const internalMode = internalModeState[0];
  const setInternalMode = internalModeState[1];

  const resolvedMode = mode !== undefined ? mode : internalMode;
  const nextMode = resolvedMode === 'dark' ? 'light' : 'dark';

  useEffect(function () {
    if (!resolvedApplyToDocument) {
      return;
    }
    applyDocumentTheme(resolvedMode);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(resolvedStorageKey, resolvedMode);
    }
  }, [resolvedApplyToDocument, resolvedMode, resolvedStorageKey]);

  function handleClick(event) {
    if (onClick) {
      onClick(event);
    }
    if (event.defaultPrevented || resolvedDisabled) {
      return;
    }
    if (!isControlled) {
      setInternalMode(nextMode);
    }
    if (onModeChange) {
      onModeChange(nextMode);
    }
  }

  var ariaLabel = rest['aria-label'] ||
    ('Переключить на ' + (nextMode === 'dark' ? 'темную' : 'светлую') + ' тему');

  return (
    <button
      {...rest}
      aria-label={ariaLabel}
      aria-pressed={resolvedMode === 'dark'}
      className={joinClassNames('rshb-legacy-theme', className)}
      data-mode={resolvedMode}
      data-preview-state={resolvedPreviewState}
      disabled={resolvedDisabled}
      onClick={handleClick}
      type={resolvedType}
    >
      <span aria-hidden="true" className="rshb-legacy-theme__icon" key={resolvedMode}>
        {resolvedMode === 'dark' ? <SunIcon /> : <MoonIcon />}
      </span>
    </button>
  );
}

import {
  useEffect,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type MouseEvent
} from 'react';
import './Theme.scss';
import moonIconUrl from '../../../icons/moon.svg';
import sunIconUrl from '../../../icons/sun.svg';

export type ThemeMode = 'light' | 'dark';
export type ThemePreviewState = 'default' | 'hover' | 'pressed' | 'focused';

export interface ThemeProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onChange'> {
  applyToDocument?: boolean;
  defaultMode?: ThemeMode;
  mode?: ThemeMode;
  onModeChange?: (mode: ThemeMode) => void;
  previewState?: ThemePreviewState;
  storageKey?: string;
}

type ThemeIconStyle = CSSProperties & {
  '--rshb-theme-icon-url': string;
};

const DEFAULT_STORAGE_KEY = 'rshbins-ui-theme';

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function getDocumentMode(): ThemeMode | undefined {
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

function getStoredMode(storageKey: string): ThemeMode | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const storedMode = window.localStorage.getItem(storageKey);
  return storedMode === 'dark' || storedMode === 'light' ? storedMode : undefined;
}

function getPreferredMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyDocumentTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.classList.toggle('theme-light', mode === 'light');
  document.documentElement.classList.toggle('theme-dark', mode === 'dark');
  document.documentElement.style.colorScheme = mode;
}

/**
 * Theme toggle button. It swaps the Moon/Sun icon and can update the document theme classes.
 */
export function Theme({
  applyToDocument = true,
  className,
  defaultMode,
  disabled = false,
  mode,
  onClick,
  onModeChange,
  previewState = 'default',
  storageKey = DEFAULT_STORAGE_KEY,
  type = 'button',
  ...props
}: ThemeProps) {
  const isControlled = mode !== undefined;
  const [internalMode, setInternalMode] = useState<ThemeMode>(() =>
    defaultMode ?? getStoredMode(storageKey) ?? getDocumentMode() ?? getPreferredMode()
  );

  const resolvedMode = mode ?? internalMode;
  const nextMode: ThemeMode = resolvedMode === 'dark' ? 'light' : 'dark';
  const iconUrl = resolvedMode === 'dark' ? sunIconUrl : moonIconUrl;
  const iconStyle = useMemo<ThemeIconStyle>(
    () => ({
      '--rshb-theme-icon-url': `url("${iconUrl}")`
    }),
    [iconUrl]
  );

  useEffect(() => {
    if (!applyToDocument) {
      return;
    }

    applyDocumentTheme(resolvedMode);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, resolvedMode);
    }
  }, [applyToDocument, resolvedMode, storageKey]);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);

    if (event.defaultPrevented || disabled) {
      return;
    }

    if (!isControlled) {
      setInternalMode(nextMode);
    }

    onModeChange?.(nextMode);
  }

  return (
    <button
      {...props}
      aria-label={props['aria-label'] ?? `Переключить на ${nextMode === 'dark' ? 'темную' : 'светлую'} тему`}
      aria-pressed={resolvedMode === 'dark'}
      className={joinClassNames('rshb-theme', className)}
      data-mode={resolvedMode}
      data-preview-state={previewState}
      disabled={disabled}
      onClick={handleClick}
      type={type}
    >
      <span aria-hidden="true" className="rshb-theme__icon" key={resolvedMode} style={iconStyle} />
    </button>
  );
}

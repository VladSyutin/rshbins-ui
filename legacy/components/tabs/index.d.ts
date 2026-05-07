import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode
} from 'react';

export type LegacyTabsActivationMode = 'automatic' | 'manual';
export type LegacyTabsChangeEvent =
  | KeyboardEvent<HTMLButtonElement>
  | MouseEvent<HTMLButtonElement>;

export interface LegacyTabsOption {
  disabled?: boolean;
  id?: string;
  label: ReactNode;
  leadingIcon?: ReactNode;
  panelId?: string;
  trailingIcon?: ReactNode;
  value: string;
}

export interface LegacyTabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'> {
  activationMode?: LegacyTabsActivationMode;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (value: string, event: LegacyTabsChangeEvent) => void;
  options: LegacyTabsOption[];
  tabProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'disabled' | 'role'>;
  value?: string;
}

export default function Tabs(props: LegacyTabsProps): JSX.Element;

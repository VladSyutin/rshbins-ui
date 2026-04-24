import './FilledCookies.scss';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Cookies, type CookiesPlacement, type CookiesPreviewState, type CookiesSize } from '../../../components/cookies/Cookies';

const DEFAULT_POLICY_HREF = 'https://rshbins.ru/about/documentation/Politika_obrabotki_PDN.pdf';

export interface FilledCookiesProps {
  className?: string;
  closeOnPrimaryAction?: boolean;
  placement?: CookiesPlacement;
  policyHref?: string;
  policyLinkProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className' | 'href'>;
  policyLabel?: ReactNode;
  previewState?: CookiesPreviewState;
  primaryActionLabel?: string | null;
  size?: CookiesSize;
  textPrefix?: ReactNode;
  textSuffix?: ReactNode;
  onClose?: () => void;
  onPrimaryAction?: () => void;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

/**
 * Filled cookie-consent dialog template composed from the shared Cookies component.
 */
export function FilledCookies({
  className,
  closeOnPrimaryAction = true,
  onClose,
  onPrimaryAction,
  placement = 'inline',
  policyHref = DEFAULT_POLICY_HREF,
  policyLabel = 'Политикой АО СК «РСХБ-Страхование»',
  policyLinkProps,
  previewState = 'shown',
  primaryActionLabel = 'Понятно',
  size = 's',
  textPrefix = 'Продолжая использование сайта, вы соглашаетесь на обработку файлов cookie и иных персональных данных с помощью сервиса Яндекс Метрика в соответствии с ',
  textSuffix = '.'
}: FilledCookiesProps) {
  return (
    <Cookies
      className={joinClassNames('rshb-filled-cookies', className)}
      closeOnPrimaryAction={closeOnPrimaryAction}
      description={
        <>
          {textPrefix}
          <a
            {...policyLinkProps}
            className="rshb-filled-cookies__link"
            href={policyHref}
            rel={policyLinkProps?.target === '_blank' ? 'noreferrer noopener' : policyLinkProps?.rel}
          >
            {policyLabel}
          </a>
          {textSuffix}
        </>
      }
      heading={null}
      onClose={onClose}
      onPrimaryAction={onPrimaryAction}
      placement={placement}
      previewState={previewState}
      primaryActionLabel={primaryActionLabel}
      secondaryActionLabel={null}
      size={size}
    />
  );
}

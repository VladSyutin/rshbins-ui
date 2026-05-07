import React from 'react';
import Cookies from '../../../components/cookies/index.js';
import './styles.css';

var DEFAULT_POLICY_HREF = 'https://rshbins.ru/about/documentation/Politika_obrabotki_PDN.pdf';

export default function FilledCookies(props) {
  var className = props.className;
  var closeOnPrimaryAction = props.closeOnPrimaryAction !== undefined ? props.closeOnPrimaryAction : true;
  var onClose = props.onClose;
  var onPrimaryAction = props.onPrimaryAction;
  var placement = props.placement !== undefined ? props.placement : 'inline';
  var policyHref = props.policyHref !== undefined ? props.policyHref : DEFAULT_POLICY_HREF;
  var policyLabel = props.policyLabel !== undefined ? props.policyLabel : 'Политикой АО СК «РСХБ-Страхование»';
  var previewState = props.previewState !== undefined ? props.previewState : 'shown';
  var primaryActionLabel = props.primaryActionLabel !== undefined ? props.primaryActionLabel : 'Понятно';
  var size = props.size !== undefined ? props.size : 's';
  var textPrefix = props.textPrefix !== undefined
    ? props.textPrefix
    : 'Продолжая использование сайта, вы соглашаетесь на обработку файлов cookie и иных персональных данных с помощью сервиса Яндекс Метрика в соответствии с ';
  var textSuffix = props.textSuffix !== undefined ? props.textSuffix : '.';

  return (
    <Cookies
      className={'rshb-legacy-filled-cookies' + (className ? ' ' + className : '')}
      closeOnPrimaryAction={closeOnPrimaryAction}
      description={
        <React.Fragment>
          {textPrefix}
          <a
            className="rshb-legacy-filled-cookies__link"
            href={policyHref}
            rel="noreferrer noopener"
          >
            {policyLabel}
          </a>
          {textSuffix}
        </React.Fragment>
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

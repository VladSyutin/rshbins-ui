import React, { useState } from 'react';
import Modal from '../../../components/modal/index.js';
import Button from '../../../components/button/index.js';
import InputCaptcha, { isCaptchaValueValid } from '../../../components/input-captcha/index.js';
import '../shared/styles.css';

function ArrowRotateLeftIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.69743 14.5 1.97116 12.0377 1.55495 8.8484C1.50135 8.43767 1.79086 8.06126 2.20159 8.00766C2.61232 7.95405 2.98874 8.24357 3.04234 8.6543C3.36233 11.1063 5.46061 13 8 13C10.7614 13 13 10.7614 13 8C13 5.23858 10.7614 3 8 3C6.60162 3 5.33742 3.57344 4.42924 4.5H5.75C6.16421 4.5 6.5 4.83579 6.5 5.25C6.5 5.66421 6.16421 6 5.75 6H2.75C2.33579 6 2 5.66421 2 5.25V2.25C2 1.83579 2.33579 1.5 2.75 1.5C3.16421 1.5 3.5 1.83579 3.5 2.25V3.30964C4.66728 2.1896 6.25322 1.5 8 1.5Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M5.06066 9.93934C4.77936 9.65804 4.39782 9.5 4 9.5H2C1.72386 9.5 1.5 9.27614 1.5 9V7C1.5 6.72386 1.72386 6.5 2 6.5H4C4.39782 6.5 4.77936 6.34196 5.06066 6.06066L7.54289 3.57843C7.59311 3.52821 7.66122 3.5 7.73223 3.5C7.88012 3.5 8 3.61988 8 3.76777V12.2322C8 12.3801 7.88012 12.5 7.73223 12.5C7.66122 12.5 7.59311 12.4718 7.54289 12.4216L5.06066 9.93934ZM2 5H4L6.48223 2.51777C6.81375 2.18625 7.26339 2 7.73223 2C8.70854 2 9.5 2.79146 9.5 3.76777V12.2322C9.5 13.2085 8.70854 14 7.73223 14C7.26339 14 6.81375 13.8138 6.48223 13.4822L4 11H2C0.89543 11 0 10.1046 0 9V7C0 5.89543 0.895431 5 2 5ZM14.1617 13.1026C13.8974 13.4215 13.4194 13.4195 13.1265 13.1266C12.8336 12.8337 12.8376 12.3612 13.095 12.0367C13.9746 10.9279 14.5 9.52533 14.5 8.00005C14.5 6.47477 13.9746 5.0722 13.095 3.96341C12.8376 3.63892 12.8336 3.16642 13.1265 2.87353C13.4194 2.58063 13.8974 2.57858 14.1617 2.89746C15.3099 4.28234 16 6.0606 16 8.00005C16 9.93951 15.3099 11.7178 14.1617 13.1026ZM12.0244 10.9677C11.7783 11.3009 11.2981 11.2981 11.0052 11.0053C10.7123 10.7124 10.7207 10.2406 10.9449 9.89229C11.2962 9.3467 11.5 8.69718 11.5 8.00005C11.5 7.30292 11.2962 6.6534 10.9449 6.10782C10.7207 5.75955 10.7123 5.28774 11.0052 4.99485C11.2981 4.70195 11.7783 4.69919 12.0244 5.03236C12.6376 5.86242 13 6.88891 13 8.00005C13 9.11119 12.6376 10.1377 12.0244 10.9677Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function GosuslugiIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.8122 5.30767C15.7421 4.48309 15.0405 3.42593 14.3396 2.91907C13.5511 2.39952 12.7316 1.91918 11.8845 1.48019C11.045 1.03017 10.1792 0.621006 9.29073 0.254458C8.81644 0.0793771 8.30732 -0.00695813 7.79455 0.000740052C7.28159 -0.00899552 6.77201 0.0774176 6.29836 0.254458C5.40982 0.621435 4.54377 1.03079 3.70392 1.48076C2.34844 2.22077 1.25018 2.91849 1.25018 2.91849C0.708994 3.3282 0.287229 3.85013 0.0213984 4.43909C-0.0581858 4.61623 0.0946159 4.80023 0.307902 4.80023H1.13303C1.36987 4.80023 1.58316 4.68023 1.71495 4.50366C1.90255 4.25295 2.12868 4.02728 2.38664 3.83336C2.38664 3.83336 3.2939 3.26136 4.41317 2.65449C5.10691 2.28535 5.82206 1.94963 6.55558 1.64876C6.94687 1.50359 7.36742 1.43276 7.79073 1.44076C8.21388 1.43443 8.63406 1.50519 9.02588 1.64876C9.75952 1.94941 10.4747 2.28514 11.1683 2.65449C11.8667 3.01392 12.5435 3.40764 13.1948 3.83336C13.7736 4.24937 14.3523 5.11624 14.4109 5.79225C14.4109 5.79225 14.5458 6.79798 14.5649 7.98885C14.5638 8.7244 14.5188 9.45937 14.43 10.1906C14.2956 10.9562 13.8568 11.6523 13.1948 12.15C13.1948 12.15 12.2876 12.7392 11.1683 13.3461C10.4745 13.7152 9.7594 14.0509 9.02588 14.3518C8.63459 14.497 8.21403 14.5678 7.79073 14.5598C7.36797 14.5677 6.94781 14.4987 6.55558 14.3569C5.82195 14.0563 5.10678 13.7206 4.41317 13.3512C3.2939 12.7615 2.38664 12.1552 2.38664 12.1552C2.15744 11.9906 1.92887 11.7552 1.73087 11.4895C1.66913 11.4028 1.58457 11.331 1.48463 11.2806C1.3847 11.2302 1.27248 11.2026 1.15786 11.2003H0.316178C0.100983 11.2003 -0.0511824 11.3883 0.0354052 11.5655C0.323182 12.1558 0.78668 12.7312 1.25082 13.0672C1.25082 13.0672 2.34908 13.8072 3.70456 14.5261C4.54497 14.9764 5.41084 15.3855 6.29964 15.7518C6.7746 15.925 7.2833 16.009 7.79582 15.9992C8.30857 16.0089 8.81793 15.9225 9.29137 15.7455C10.1799 15.3788 11.046 14.9696 11.8858 14.5198C13.2419 13.7792 14.3402 13.0609 14.3402 13.0609C15.143 12.4521 15.6743 11.6038 15.8364 10.6717C15.944 9.7803 15.9981 8.88315 16 7.98599C15.9764 6.53397 15.8122 5.30767 15.8122 5.30767Z" fill="currentColor" />
      <path d="M5 6.6315C5 6.44329 5.15179 6.2915 5.34 6.2915H10.61C10.7982 6.2915 10.95 6.44329 10.95 6.6315V7.6515C10.95 7.83911 10.7982 7.9915 10.61 7.9915H5V6.6315Z" fill="currentColor" />
      <path d="M2 9.01074H12.71C12.8982 9.01074 13.05 9.16314 13.05 9.35074V10.3707C13.05 10.559 12.8982 10.7107 12.71 10.7107H2.34C2.24983 10.7107 2.16335 10.6749 2.09958 10.6112C2.03582 10.5474 2 10.4609 2 10.3707V9.01074Z" fill="currentColor" />
    </svg>
  );
}

export default function Captcha(props) {
  var captchaLabel = props.captchaLabel !== undefined ? props.captchaLabel : '        ';
  var closeOnContinue = props.closeOnContinue !== undefined ? props.closeOnContinue : false;
  var continueLabel = props.continueLabel !== undefined ? props.continueLabel : 'Продолжить';
  var continueLoading = props.continueLoading !== undefined ? props.continueLoading : false;
  var defaultCodeValue = props.defaultCodeValue !== undefined ? props.defaultCodeValue : '';
  var description = props.description !== undefined
    ? props.description
    : 'Обнаружена подозрительная активность. Пожалуйста, введите код с картинки';
  var heading = props.heading !== undefined ? props.heading : 'Подозрительная активность';
  var inputLabel = props.inputLabel !== undefined ? props.inputLabel : 'Код с картинки';
  var inputValue = props.inputValue;
  var onClose = props.onClose;
  var onContinue = props.onContinue;
  var onInputValueChange = props.onInputValueChange;
  var onLogInThroughGosuslugi = props.onLogInThroughGosuslugi;
  var onRefreshCaptcha = props.onRefreshCaptcha;
  var onVoiceCaptcha = props.onVoiceCaptcha;
  var placement = props.placement !== undefined ? props.placement : 'inline';
  var previewState = props.previewState !== undefined ? props.previewState : 'shown';

  var isControlled = inputValue !== undefined;
  var uncontrolledValueState = useState(defaultCodeValue);
  var uncontrolledInputValue = uncontrolledValueState[0];
  var setUncontrolledInputValue = uncontrolledValueState[1];
  var resolvedInputValue = isControlled ? String(inputValue != null ? inputValue : '') : uncontrolledInputValue;
  var isContinueDisabled = continueLoading || !isCaptchaValueValid(resolvedInputValue);

  function handleInputValueChange(nextValue) {
    if (!isControlled) {
      setUncontrolledInputValue(nextValue);
    }
    if (onInputValueChange) {
      onInputValueChange(nextValue);
    }
  }

  return (
    <Modal
      description={description}
      heading={heading}
      onClose={onClose}
      placement={placement}
      previewState={previewState}
      actions={function (ctx) {
        return (
          <div className="rshb-legacy-dialog-modal__actions">
            <Button
              className="rshb-legacy-dialog-modal__action"
              disabled={isContinueDisabled}
              loading={continueLoading}
              onClick={function () {
                if (onContinue) { onContinue(); }
                if (closeOnContinue) { ctx.requestClose(); }
              }}
              variant="brand"
            >
              {continueLabel}
            </Button>
            <Button
              className="rshb-legacy-dialog-modal__action"
              leadingIcon={<GosuslugiIcon />}
              onClick={onLogInThroughGosuslugi}
              variant="normal"
            >
              Войти через Госуслуги
            </Button>
            <Button
              className="rshb-legacy-dialog-modal__action"
              onClick={ctx.requestClose}
              variant="flat-primary"
            >
              Закрыть
            </Button>
          </div>
        );
      }}
    >
      <div className="rshb-legacy-dialog-modal">
        <div className="rshb-legacy-dialog-modal__captcha">
          <div aria-hidden="true" className="rshb-legacy-dialog-modal__captcha-symbols">
            <span className="rshb-legacy-dialog-modal__captcha-text">{captchaLabel}</span>
          </div>
          <Button
            aria-label="Обновить капчу"
            className="rshb-legacy-dialog-modal__captcha-action"
            iconOnly={true}
            leadingIcon={<ArrowRotateLeftIcon />}
            onClick={onRefreshCaptcha}
            variant="flat-primary"
          />
          <Button
            aria-label="Озвучить капчу"
            className="rshb-legacy-dialog-modal__captcha-action"
            iconOnly={true}
            leadingIcon={<VolumeIcon />}
            onClick={onVoiceCaptcha}
            variant="flat-primary"
          />
        </div>
        <div className="rshb-legacy-dialog-modal__field">
          <InputCaptcha
            label={inputLabel}
            onValueChange={handleInputValueChange}
            value={resolvedInputValue}
          />
        </div>
      </div>
    </Modal>
  );
}

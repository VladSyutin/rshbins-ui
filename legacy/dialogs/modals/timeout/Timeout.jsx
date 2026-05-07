import React, { useEffect, useState } from 'react';
import Modal from '../../../components/modal/index.js';
import Button from '../../../components/button/index.js';
import '../shared/styles.css';

function GosuslugiIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.8122 5.30767C15.7421 4.48309 15.0405 3.42593 14.3396 2.91907C13.5511 2.39952 12.7316 1.91918 11.8845 1.48019C11.045 1.03017 10.1792 0.621006 9.29073 0.254458C8.81644 0.0793771 8.30732 -0.00695813 7.79455 0.000740052C7.28159 -0.00899552 6.77201 0.0774176 6.29836 0.254458C5.40982 0.621435 4.54377 1.03079 3.70392 1.48076C2.34844 2.22077 1.25018 2.91849 1.25018 2.91849C0.708994 3.3282 0.287229 3.85013 0.0213984 4.43909C-0.0581858 4.61623 0.0946159 4.80023 0.307902 4.80023H1.13303C1.36987 4.80023 1.58316 4.68023 1.71495 4.50366C1.90255 4.25295 2.12868 4.02728 2.38664 3.83336C2.38664 3.83336 3.2939 3.26136 4.41317 2.65449C5.10691 2.28535 5.82206 1.94963 6.55558 1.64876C6.94687 1.50359 7.36742 1.43276 7.79073 1.44076C8.21388 1.43443 8.63406 1.50519 9.02588 1.64876C9.75952 1.94941 10.4747 2.28514 11.1683 2.65449C11.8667 3.01392 12.5435 3.40764 13.1948 3.83336C13.7736 4.24937 14.3523 5.11624 14.4109 5.79225C14.4109 5.79225 14.5458 6.79798 14.5649 7.98885C14.5638 8.7244 14.5188 9.45937 14.43 10.1906C14.2956 10.9562 13.8568 11.6523 13.1948 12.15C13.1948 12.15 12.2876 12.7392 11.1683 13.3461C10.4745 13.7152 9.7594 14.0509 9.02588 14.3518C8.63459 14.497 8.21403 14.5678 7.79073 14.5598C7.36797 14.5677 6.94781 14.4987 6.55558 14.3569C5.82195 14.0563 5.10678 13.7206 4.41317 13.3512C3.2939 12.7615 2.38664 12.1552 2.38664 12.1552C2.15744 11.9906 1.92887 11.7552 1.73087 11.4895C1.66913 11.4028 1.58457 11.331 1.48463 11.2806C1.3847 11.2302 1.27248 11.2026 1.15786 11.2003H0.316178C0.100983 11.2003 -0.0511824 11.3883 0.0354052 11.5655C0.323182 12.1558 0.78668 12.7312 1.25082 13.0672C1.25082 13.0672 2.34908 13.8072 3.70456 14.5261C4.54497 14.9764 5.41084 15.3855 6.29964 15.7518C6.7746 15.925 7.2833 16.009 7.79582 15.9992C8.30857 16.0089 8.81793 15.9225 9.29137 15.7455C10.1799 15.3788 11.046 14.9696 11.8858 14.5198C13.2419 13.7792 14.3402 13.0609 14.3402 13.0609C15.143 12.4521 15.6743 11.6038 15.8364 10.6717C15.944 9.7803 15.9981 8.88315 16 7.98599C15.9764 6.53397 15.8122 5.30767 15.8122 5.30767Z"
        fill="currentColor"
      />
      <path d="M5 6.6315C5 6.44329 5.15179 6.2915 5.34 6.2915H10.61C10.7982 6.2915 10.95 6.44329 10.95 6.6315V7.6515C10.95 7.83911 10.7982 7.9915 10.61 7.9915H5V6.6315Z" fill="currentColor" />
      <path d="M2 9.01074H12.71C12.8982 9.01074 13.05 9.16314 13.05 9.35074V10.3707C13.05 10.559 12.8982 10.7107 12.71 10.7107H2.34C2.24983 10.7107 2.16335 10.6749 2.09958 10.6112C2.03582 10.5474 2 10.4609 2 10.3707V9.01074Z" fill="currentColor" />
    </svg>
  );
}

export default function Timeout(props) {
  var countdownDurationSeconds = props.countdownDurationSeconds !== undefined ? props.countdownDurationSeconds : 30 * 60;
  var description = props.description;
  var heading = props.heading !== undefined ? props.heading : 'Подозрительная активность';
  var onClose = props.onClose;
  var onLogInThroughGosuslugi = props.onLogInThroughGosuslugi;
  var placement = props.placement !== undefined ? props.placement : 'inline';
  var previewState = props.previewState !== undefined ? props.previewState : 'shown';

  var secondsLeftState = useState(countdownDurationSeconds);
  var secondsLeft = secondsLeftState[0];
  var setSecondsLeft = secondsLeftState[1];

  var minutes = Math.floor(secondsLeft / 60);
  var seconds = secondsLeft % 60;
  var formattedTime = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  var resolvedDescription = description != null
    ? description
    : (secondsLeft > 0
      ? 'Слишком много попыток ввода. Войдите через Госуслуги или продолжите через ' + formattedTime
      : 'Слишком много попыток ввода. Теперь можно повторить попытку');

  useEffect(function () {
    setSecondsLeft(countdownDurationSeconds);
  }, [countdownDurationSeconds]);

  useEffect(function () {
    if (secondsLeft <= 0) {
      return undefined;
    }
    var timerId = window.setInterval(function () {
      setSecondsLeft(function (current) { return Math.max(current - 1, 0); });
    }, 1000);
    return function () {
      window.clearInterval(timerId);
    };
  }, [secondsLeft]);

  return (
    <Modal
      description={resolvedDescription}
      heading={heading}
      onClose={onClose}
      placement={placement}
      previewState={previewState}
      actions={function (ctx) {
        return (
          <div className="rshb-legacy-dialog-modal__actions">
            <Button
              className="rshb-legacy-dialog-modal__action"
              leadingIcon={<GosuslugiIcon />}
              onClick={onLogInThroughGosuslugi}
              variant="brand"
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
    />
  );
}

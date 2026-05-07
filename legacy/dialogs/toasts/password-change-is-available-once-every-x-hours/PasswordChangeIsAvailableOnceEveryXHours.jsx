import React from 'react';
import DialogToastTemplate from '../shared/DialogToastTemplate.jsx';

export default function PasswordChangeIsAvailableOnceEveryXHours(props) {
  return <DialogToastTemplate {...props} message="Смена пароля доступна раз в 24 ч" variant="danger" />;
}

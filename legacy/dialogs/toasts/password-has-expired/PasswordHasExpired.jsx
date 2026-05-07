import React from 'react';
import DialogToastTemplate from '../shared/DialogToastTemplate.jsx';

export default function PasswordHasExpired(props) {
  return <DialogToastTemplate {...props} message="Срок действия пароля истёк" variant="danger" />;
}

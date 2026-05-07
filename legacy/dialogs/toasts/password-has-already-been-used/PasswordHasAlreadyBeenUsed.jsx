import React from 'react';
import DialogToastTemplate from '../shared/DialogToastTemplate.jsx';

export default function PasswordHasAlreadyBeenUsed(props) {
  return <DialogToastTemplate {...props} message="Пароль уже был использован" variant="danger" />;
}

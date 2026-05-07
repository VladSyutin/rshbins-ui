import React from 'react';
import DialogToastTemplate from '../shared/DialogToastTemplate.jsx';

export default function TheUserIsRegistered(props) {
  return <DialogToastTemplate {...props} message="Пользователь зарегистрирован" variant="danger" />;
}

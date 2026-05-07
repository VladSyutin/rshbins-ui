import React from 'react';
import DialogToastTemplate from '../shared/DialogToastTemplate.jsx';

export default function TheUserWasNotFound(props) {
  return <DialogToastTemplate {...props} message="Пользователь не найден" variant="danger" />;
}

import React from 'react';
import DialogToastTemplate from '../shared/DialogToastTemplate.jsx';

export default function NewCodeHasBeenSent(props) {
  return <DialogToastTemplate {...props} message="Новый код отправлен" variant="success" />;
}

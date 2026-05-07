import React from 'react';
import DialogToastTemplate from '../shared/DialogToastTemplate.jsx';

export default function NewInstructionsHaveBeenSent(props) {
  return <DialogToastTemplate {...props} message="Новая инструкция отправлена" variant="success" />;
}

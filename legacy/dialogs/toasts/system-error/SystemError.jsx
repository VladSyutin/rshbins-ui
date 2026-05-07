import React from 'react';
import DialogToastTemplate from '../shared/DialogToastTemplate.jsx';

export default function SystemError(props) {
  return <DialogToastTemplate {...props} message="Что-то пошло не так" variant="danger" />;
}

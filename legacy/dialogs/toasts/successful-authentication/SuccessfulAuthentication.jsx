import React from 'react';
import DialogToastTemplate from '../shared/DialogToastTemplate.jsx';

export default function SuccessfulAuthentication(props) {
  return <DialogToastTemplate {...props} message="Успешный вход" variant="success" />;
}

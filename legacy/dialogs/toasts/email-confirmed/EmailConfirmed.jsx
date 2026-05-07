import React from 'react';
import DialogToastTemplate from '../shared/DialogToastTemplate.jsx';

export default function EmailConfirmed(props) {
  return <DialogToastTemplate {...props} message="Адрес эл. почты подтверждён" variant="success" />;
}

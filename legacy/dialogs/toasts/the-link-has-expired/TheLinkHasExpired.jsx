import React from 'react';
import DialogToastTemplate from '../shared/DialogToastTemplate.jsx';

export default function TheLinkHasExpired(props) {
  return <DialogToastTemplate {...props} message="Срок действия ссылки истёк" variant="danger" />;
}

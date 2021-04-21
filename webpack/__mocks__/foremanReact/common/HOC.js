import React from 'react';

export const withRenderHandler = ({ Component }) => componentProps => (
  <Component {...componentProps} />
);

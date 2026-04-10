import React from 'react';
import EnabledCell from '../EnabledCell';

const enabledCellFormatter = () => (value, extra) => {
  const condition = extra?.rowData != null ? value : value?.enabled;
  return <EnabledCell condition={Boolean(condition)} />;
};

export default enabledCellFormatter;

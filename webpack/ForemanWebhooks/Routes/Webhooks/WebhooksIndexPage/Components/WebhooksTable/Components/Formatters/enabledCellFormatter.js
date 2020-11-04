import React from 'react';
import EnabledCell from '../EnabledCell';

const enabledCellFormatter = () => value => <EnabledCell condition={value} />;

export default enabledCellFormatter;

import React from 'react';

export const Table = () => <div className="table" />;
export const createTableReducer = jest.fn(controller => controller);
export const cellFormatter = cell => cell;
export const deleteActionCellFormatter = cell => cell;
export const sortableColumn = jest.fn();
export const column = (
  property,
  label,
  headFormat,
  cellFormat,
  headProps = {},
  cellProps = {}
) => ({
  property,
  header: {
    label,
    props: headProps,
    formatters: headFormat,
  },
  cell: {
    props: cellProps,
    formatters: cellFormat,
  },
});

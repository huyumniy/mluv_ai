import type { ReactNode } from 'react';

export type ColumnVisibility = 
    | "always"
    | "hide-lg"
    | "hide-md"
    | "hide-sm"

export interface Column<T> {
  id: string;
  accessorKey?: keyof T;
  header: ReactNode;
  render?: (
    value: T[keyof T] | undefined,
    row: T,
  ) => ReactNode;
  visibility?: ColumnVisibility;
};

export type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];

  activeRowId?: string | number;
  onRowClick?: (row: T) => void;
};

export type TableHeaderProps<T> = {
  columns: Column<T>[];
};

export type TableRowProps<T> = {
  row: T;
  columns: Column<T>[];

  activeRowId?: string | number;
  onClick?: (row: T) => void;
};

export type TableCellProps<T> = {
  value: T[keyof T] | undefined;
  row: T;
  render?: (
    value: T[keyof T],
    row: T,
  ) => ReactNode;
  visibility?: ColumnVisibility;
};

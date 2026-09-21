import type {
  DataTableProps,
  TableCellProps,
  TableHeaderProps,
  TableRowProps,
} from "./DataTable.types";

import styles from "./DataTable.module.css";
import clsx from "clsx";

function TableHeader<T>({ columns }: TableHeaderProps<T>) {
  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th
            key={String(column.id)}
            className={styles[column.visibility ?? "always"]}
          >
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function TableRow<T extends { id: number | string }>({
  row,
  columns,
  onClick,
  activeRowId,
}: TableRowProps<T>) {
  return (
    <tr
      className={styles.tableRow}
      onClick={() => onClick?.(row)}
      data-active={activeRowId === row.id}
      data-clickable={Boolean(onClick)}
    >
      {columns.map((column) => (
        <TableCell
          key={column.id}
          value={column.accessorKey ? row[column.accessorKey] : undefined}
          row={row}
          render={column.render}
          visibility={column.visibility}
        />
      ))}
    </tr>
  );
}

function TableCell<T>({
  value,
  row,
  render,
  visibility = "always",
}: TableCellProps<T>) {
  return (
    <td className={clsx(styles[visibility], styles.cell)}>
      {render ? render(value, row) : String(value ?? "")}
    </td>
  );
}

export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  onRowClick,
  activeRowId
}: DataTableProps<T>) {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <TableHeader columns={columns} />
        <tbody>
          {data.map((row) => (
            <TableRow activeRowId={activeRowId} onClick={onRowClick} key={row.id} row={row} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

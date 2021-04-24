import React from "react"
import PropTypes from "prop-types"
import { DataGrid } from '@material-ui/data-grid';

const columns = [
  { field: 'id', headerName: 'ID'},
  { field: 'firstName', headerName: 'First name' },
  { field: 'lastName', headerName: 'Last name' },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    valueGetter: (params) =>
      `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
  },
];

export default function OrderDisplay(props) {
  const { rows } = props;
  const columnHeaders = Object.keys(rows[0]);

  let columns = [];

  rows.map((row, index) => {
    console.log(row);
    columns.push({ field: columnHeaders[index], headerName: columnHeaders[index], sortable: true})
  });

  return (
    <div style={{ height: 400, width: '100%', fontSize: '15em' }}>
      <DataGrid
        autoHeight autoPageSize
        rows={rows} columns={columns} pageSize={5} checkboxSelection
      />
    </div>
  );
}

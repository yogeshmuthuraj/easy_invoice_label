import React from "react"
import PropTypes from "prop-types"
import { DataGrid } from '@material-ui/data-grid';

function toTitleCase(str) {
  str = str.replace(/_/g, ' ');
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

export default function OrderDisplay(props) {
  const { rows } = props;
  const columnHeaders = Object.keys(rows[0]);
  let columns = [];

  rows.map((row, index) => {
    var header = columnHeaders[index];
    var width = (header.match(/is/g) || []).length * 100;

    columns.push({
      field: header, headerName: toTitleCase(header), sortable: true, width: width
    })
  });

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid
        autoPageSize
        className="font-size-14"
        rows={rows} columns={columns} pageSize={10} checkboxSelection
      />
    </div>
  );
}

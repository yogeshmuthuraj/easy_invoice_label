import React from "react"
import PropTypes from "prop-types"

import { Page, Card } from '@shopify/polaris';

import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';

import CarrierData from './CarrierData';

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
  const isRowSelected = true;

  rows.map((row, index) => {
    var header = columnHeaders[index];
    console.log('header', header);
    var width = (header.length) * 50;
    console.log('width', width);

    columns.push({
      field: header, headerName: toTitleCase(header), sortable: true, width: width
    })
  });

  const [selectionModel, setSelectionModel] = React.useState([]);

  console.log('selectionModel');
  console.log(selectionModel);

  return (
    <React.Fragment>
      <Page title="Choose orders" fullWidth fullHeight>
        <Card>
          <div style={{ height: 500, width: '100%' }}>
            <DataGrid
              autoPageSize
              className="font-size-14"
              rows={rows} columns={columns} pageSize={10} checkboxSelection
              onSelectionModelChange={(newSelection) => {
                setSelectionModel(newSelection.selectionModel);
              }}
              selectionModel={selectionModel}
            />
          </div>
        </Card>
      </Page>
      <Page title="Upload carrier file" fullWidth fullHeight>
        <Card>
          <CarrierData />
        </Card>
      </Page>
    </React.Fragment>
  );
}

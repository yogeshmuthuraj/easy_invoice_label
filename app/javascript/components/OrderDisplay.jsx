import React from "react"
import PropTypes from "prop-types"

import { Page, Card } from '@shopify/polaris';

import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';

import { useLocation, useHistory } from "react-router-dom";

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
  const location = useLocation();
  let columns = [];
  let rows;
  let columnHeaders;

  if (props.from == 'fetchOrders') {
    rows = props.rows;
    columnHeaders = Object.keys(rows[0]);

    columnHeaders.map((columnHeader) => {
      columns.push({
        field: columnHeader, headerName: toTitleCase(columnHeader), sortable: true, width: 200
      })
    });
  } else {
    let modifiedRows = [];

    rows = JSON.parse(location.state.rows);
    columnHeaders = Object.keys(rows[0]);

    columnHeaders.map((columnHeader) => {
      columns.push({
        field: columnHeader, headerName: toTitleCase(columnHeader), sortable: true, width: 200
      })
    });

    rows.map((row, index) => {
      modifiedRows.push(Object.assign(row, { id: `${index + '_' + row.Name}` }));
    });

    rows = modifiedRows;
  }

  const [selectionModel, setSelectionModel] = React.useState([]);

  console.log('selectionModel');
  console.log(selectionModel);

  let nextDisabled = selectionModel.length > 0 ? false : true;

  let history = useHistory();

  function handleNext() {
    history.push({
      pathname: '/carrierInput',
      state: {
        selectedRowIds: selectionModel,
        rows: rows,
      }
    })
  }

  function handleCancel() {
    history.push("/");
  }

  function handleBack() {
    history.goBack();
  }

  return (
    <React.Fragment>
      <Page fullHeight>
        <div className="pad-bottom-20">
          Choose orders
        </div>
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
        <Button variant="outlined" onClick={handleBack} className="margin-top-20 pull-left">
          Back
        </Button>
        <Button variant="outlined" color="primary" onClick={handleCancel} className="margin-left-10 margin-top-20 pull-left">
          Cancel
        </Button>
        <Button
          variant="contained" color="primary" onClick={handleNext} className="margin-top-20 pull-right"
          disabled={nextDisabled}
        >
          Next
        </Button>

      </Page>
    </React.Fragment>
  );
}

import React from "react"
import PropTypes from "prop-types"

import { Page, Card } from '@shopify/polaris';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { useHistory, useLocation } from "react-router-dom";

import Barcode from 'react-barcode';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  input: {
    display: 'none',
  },
}));

export default function CarrierInput(props) {
  const classes = useStyles();
  const uploadButton = (
    <React.Fragment>
      <input
        className={classes.input}
        id="contained-button-file"
        type="file"
        accept='.csv'
        onChange={e => handleFileChosen(e.target.files[0])}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span">
          Upload
        </Button>
      </label>
    </React.Fragment>
  );

  let fileReader;

  const handleFileChosen = (file) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  }

  const handleFileRead = (e) => {
    const content = fileReader.result;

    const csv = require('csvtojson');

    (async () => {
      const jsonObj = await csv().fromString(content)

      handleUpload(jsonObj)
    })();
  }

  const history = useHistory();
  const location = useLocation();

  function handleUpload(carrierRows) {
    let orderRows = location.state.rows;
    let selectedRowIds = location.state.selectedRowIds;

    // select rows
    let selectedOrderRows = [];

    orderRows.map((orderRow, index) => {
      selectedRowIds.map((selectedRowId) => {
        if (orderRows[index].id == selectedRowId) {
          selectedOrderRows.push(orderRows[index]);
        }
      })
    })

    let groupedOrders = groupSameOrders(selectedOrderRows);

    let mergedOrders = mergeRows(groupedOrders, carrierRows)

    let filteredUniqueOrders = uniqueOrders(mergedOrders);

    let sortedOrders = sortingBasedOnCarrier(filteredUniqueOrders);

    console.log('sortedOrders');
    console.log(sortedOrders);


    history.push({
      pathname: '/printPreview',
      state: {
        orderRows: sortedOrders,
      }
    });
  }

  function groupSameOrders(selectedOrderRows) {
    let compareClonedRows = Object.assign(selectedOrderRows);
    let groupedOrders = [];

    console.log('selectedOrderRows');
    console.log(selectedOrderRows);

    selectedOrderRows.map((selectedOrderRow, index) => {
      let tempDetails = [];

      compareClonedRows.map((compareClonedRow) => {
        if (selectedOrderRows[index].Name == compareClonedRow.Name) {
          tempDetails.push({
            'Lineitem name': compareClonedRow['Lineitem name'],
            'Lineitem price': compareClonedRow['Lineitem price'],
            'Lineitem sku': compareClonedRow['Lineitem sku'],
            'Tax 1 Name': compareClonedRow['Tax 1 Name'],
            'Tax 1 Value': compareClonedRow['Tax 1 Value'],
            'Tax 2 Name': compareClonedRow['Tax 2 Name'],
            'Tax 2 Value': compareClonedRow['Tax 2 Value'],
            'Currency': compareClonedRow['Currency']
          });
        }
      });

      groupedOrders.push({
        'Name': selectedOrderRow['Name'],
        'Taxes': selectedOrderRow['Taxes'],
        'Total': selectedOrderRow['Total'],
        'Outstanding Balance': selectedOrderRow['Outstanding Balance'],
        'Created at': selectedOrderRow['Created at'],
        'Shipping Name': selectedOrderRow['Shipping Name'],
        'Shipping Address1': selectedOrderRow['Shipping Address1'],
        'Shipping Address2': selectedOrderRow['Shipping Address2'],
        'Shipping Street': selectedOrderRow['Shipping Street'],
        'Shipping City': selectedOrderRow['Shipping City'],
        'Shipping Zip': selectedOrderRow['Shipping Zip'],
        'Shipping Province': selectedOrderRow['Shipping Province'],
        'Payment Method': selectedOrderRow['Payment Method'],
        'More Details': tempDetails
      });
    });

    return groupedOrders;
  }

  function uniqueOrders(groupedOrders) {
    return groupedOrders.filter((v,i,a)=>a.findIndex(t=>(t.Name === v.Name))===i);
  }

  function mergeRows(filteredUniqueOrders, carrierRows) {
    let mergedRows = [];

    filteredUniqueOrders.map((filteredUniqueOrder, index) => {
      carrierRows.map((carrierRow) => {
        if (filteredUniqueOrders[index].Name == carrierRow.Name) {
          mergedRows.push(Object.assign(filteredUniqueOrders[index], carrierRow))
        }
      });
    });

    return mergedRows;
  }

  function sortingBasedOnCarrier(csvObject) {
    return csvObject.sort((a, b) => (a.Carrier > b.Carrier) ? 1 : (a.Carrier === b.Carrier) ? ((a.size > b.size) ? 1 : -1) : -1 );
  }

  function barcode(value) {
    return <Barcode value={value} />;
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
          Choose carriers
        </div>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Paper className={classes.paper}>
                {uploadButton}
              </Paper>
            </Grid>
          </Grid>
        </div>
        <Button variant="outlined" onClick={handleBack} className="margin-top-20 pull-left">
          Back
        </Button>
        <Button variant="outlined" color="primary" onClick={handleCancel} className="margin-left-10 margin-top-20 pull-left">
          Cancel
        </Button>
      </Page>
    </React.Fragment>
  );
}

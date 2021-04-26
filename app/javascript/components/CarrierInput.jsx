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

  //var csv is the CSV file with headers
  function csvToJSON(csv){
    var lines=csv.split("\n");
    var result = [];
    var headers=lines[0].split(",");

    for (var i=1;i<lines.length;i++){
  	  var obj = {};
  	  var currentline=lines[i].split(",");

  	  for(var j=0;j<headers.length;j++){
  		  obj[headers[j]] = currentline[j];
  	  }
  	  result.push(obj);
    }

    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
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

    let mergedRows = mergeCsvs(selectedOrderRows, carrierRows)
    console.log(groupSameOrders(mergedRows));

    // let sortedCsvObject = sortingBasedOnCarrier(mergedRows);
    // console.log('sorted');
    // console.log(sortedCsvObject);



    // history.push({
    //   pathname: '/printPreview',
    //   state: {
    //     rows: csvJson,
    //   }
    // });
  }

  function mergeCsvs(selectedOrderRows, carrierRows) {
    let mergedRows = [];

    selectedOrderRows.map((selectedOrderRow, index) => {
      carrierRows.map((carrierRow) => {
        if (selectedOrderRows[index].Name == carrierRow.Name) {
          mergedRows.push(Object.assign(selectedOrderRows[index], carrierRow))
        }
      });
    });

    return mergedRows;
  }

  function sortingBasedOnCarrier(csvObject) {
    return csvObject.sort((a, b) => (a.Carrier > b.Carrier) ? 1 : (a.Carrier === b.Carrier) ? ((a.size > b.size) ? 1 : -1) : -1 );
  }

  function groupSameOrders(mergedRows) {
    let compareClonedRows = Object.assign(mergedRows);
    let groupedOrders = [];

    console.log('mergedRows');
    console.log(mergedRows);

    mergedRows.map((mergedRow, index) => {
      let tempDetails = [];

      compareClonedRows.map((compareClonedRow) => {
        if (mergedRows[index].Name == compareClonedRow.Name) {
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
        'Name': mergedRow['Name'],
        'Carrier': mergedRow['Carrier'],
        'AWB': mergedRow['AWB'],
        'Taxes': mergedRow['Taxes'],
        'Total': mergedRow['Total'],
        'Outstanding Balance': mergedRow['Outstanding Balance'],
        'Created at': mergedRow['Created at'],
        'Shipping Name': mergedRow['Shipping Name'],
        'Shipping Address1': mergedRow['Shipping Address1'],
        'Shipping Address2': mergedRow['Shipping Address2'],
        'Shipping Street': mergedRow['Shipping Street'],
        'Shipping City': mergedRow['Shipping City'],
        'Shipping Zip': mergedRow['Shipping Zip'],
        'Shipping Province': mergedRow['Shipping Province'],
        'Payment Method': mergedRow['Payment Method'],
        'More Details': tempDetails
      });
    });

    return groupedOrders;
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

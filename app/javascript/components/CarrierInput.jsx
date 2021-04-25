import React from "react"
import PropTypes from "prop-types"

import { Page, Card } from '@shopify/polaris';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { useHistory, useLocation } from "react-router-dom";

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
    const csvJson = csvToJSON(content);
    handleUpload(csvJson)
  }

  let history = useHistory();
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

    let mergedCsv = mergeCsvs(selectedOrderRows, JSON.parse(carrierRows))
    let sortedCsv = sortingBasedOnCarrier(mergedCsv);
  }

  function mergeCsvs(selectedOrderRows, carrierRows) {
    console.log('carrierRows; ', carrierRows);
    console.log(selectedOrderRows);
    let mergedCsv = [];

    selectedOrderRows.map((selectedOrderRow, index) => {
      carrierRows.map((carrierRow) => {
        if (selectedOrderRows[index].Name == carrierRow.Name) {
          mergedCsv.push(Object.assign(selectedOrderRows[index], carrierRow))
        }
      });
    });

    return mergedCsv;
  }

  function sortingBasedOnCarrier(mergedCsv) {
    return mergedCsv.sort((a, b) => (a.color > b.color) ? 1 : (a.color === b.color) ? ((a.size > b.size) ? 1 : -1) : -1 );
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

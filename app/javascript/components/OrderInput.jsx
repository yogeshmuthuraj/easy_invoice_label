import React from "react"
import PropTypes from "prop-types"

import { Page, Card } from '@shopify/polaris';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { useHistory } from "react-router-dom";

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

export default function OrderInput(props) {
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
  const fetchButton = (
    <Button
      variant="contained"
      color="primary"
      onClick={handleFetch}
    >
      Fetch
    </Button>
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

  function handleFetch() {
    history.push("/fetchOrders");
  }

  function handleUpload(csvJson) {
    // history.push("/orderDisplay");
    history.push({
      pathname: '/fetchOrders',
      state: {
        rows: csvJson,
      }
    })
  }

  return (
    <React.Fragment>
      <Page fullHeight>
          <div className={classes.root}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  {uploadButton}
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  {fetchButton}
                </Paper>
              </Grid>
            </Grid>
          </div>
      </Page>
    </React.Fragment>
  );
}

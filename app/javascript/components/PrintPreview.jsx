import React from "react"
import PropTypes from "prop-types"

import { Page, Card } from '@shopify/polaris';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { useHistory, useLocation } from "react-router-dom";
// import { StyleSheet } from '@react-pdf/renderer';

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

// Create styles
// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'row',
//     backgroundColor: '#E4E4E4'
//   },
//   section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1
//   }
// });

// const MyDocument = (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <View style={styles.section}>
//         <Text>Section #1</Text>
//       </View>
//       <View style={styles.section}>
//         <Text>Section #2</Text>
//       </View>
//     </Page>
//   </Document>
// );

export default function PrintPreview(props) {
  const classes = useStyles();

  const history = useHistory();
  const location = useLocation();

  let orderRows = location.state.orderRows;

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
          PDF
        </div>
        <div className={classes.root}>
          <Grid container spacing={3}>

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

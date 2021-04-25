import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { useHistory, Redirect } from "react-router-dom";

import Orders from './OrderInput';
import OrderDisplay from './OrderDisplay';
import FetchOrders from './FetchOrders';
import Carrier from './CarrierData';
import Pdf from './PreviewPrint';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

export default function Routing() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  let ordersDisabled;
  let carrierDisabled = true;
  let pdfDisabled = true;

  function handleChange(event, newValue) {
    setValue(newValue);
    console.log('newValue: ', newValue);

    if (newValue == 0) {
      <Redirect push to="/" />
    } else if (newValue == 1) {
      <Redirect push to="/carrier" />
    } else if (newValue == 2) {
      <Redirect push to="/pdf" />
    }
  }

  return (
    <Router>
      <AppProvider i18n={enTranslations}>
        <div>
          <Paper className={classes.root}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
             >
              <Tab label="Orders" disabled={ordersDisabled} />
              <Tab label="Carrier" disabled={carrierDisabled} />
              <Tab label="PDF" disabled={pdfDisabled} />
            </Tabs>
          </Paper>
          <Switch>
            <Route exact path="/">
              <Orders />
            </Route>
            <Route exact path="/fetchOrders">
              <FetchOrders />
            </Route>
            <Route exact path="/orderDisplay">
              <OrderDisplay />
            </Route>
            <Route path="/carrier">
              <Carrier />
            </Route>
            <Route path="/pdf">
              <Pdf />
            </Route>
          </Switch>
        </div>
      </AppProvider>
    </Router>
  );
}

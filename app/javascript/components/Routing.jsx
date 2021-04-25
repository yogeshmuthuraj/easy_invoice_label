import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';

import Orders from './OrderInput';
import FetchOrders from './FetchOrders';
import Carrier from './CarrierData';
import Pdf from './PreviewPrint';

export default function Routing() {
  return (
    <Router>
      <AppProvider i18n={enTranslations}>
        <div>
          <Link to="/">Orders</Link>
          <Link to="/carrier">Carrier</Link>
          <Link to="/pdf">PDF</Link>

          <hr />

          <Switch>
            <Route exact path="/">
              <Orders />
            </Route>
            <Route exact path="/fetchOrders">
              <FetchOrders />
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

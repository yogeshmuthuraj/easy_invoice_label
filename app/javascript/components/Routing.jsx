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
import OrderDisplay from './OrderDisplay';
import FetchOrders from './FetchOrders';
import Carrier from './CarrierInput';
import CarrierInput from './CarrierInput';
import PrintPreview from './PrintPreview';

export default function Routing() {
  return (
    <Router>
      <AppProvider i18n={enTranslations}>
        <div>
          <Switch>
            <Route exact path="/">
              <Orders />
            </Route>
            <Route path="/carrier">
              <Carrier />
            </Route>
            <Route exact path="/fetchOrders">
              <FetchOrders />
            </Route>
            <Route exact path="/orderDisplay">
              <OrderDisplay />
            </Route>
            <Route exact path="/carrierInput">
              <CarrierInput />
            </Route>
            <Route exact path="/printPreview">
              <PrintPreview />
            </Route>
          </Switch>
        </div>
      </AppProvider>
    </Router>
  );
}

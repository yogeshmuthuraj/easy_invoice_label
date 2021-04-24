import React from "react"
import PropTypes from "prop-types"

import '@shopify/polaris/dist/styles.css';
import { AppProvider, Page, Card, Layout } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';

import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import CssBaseline from '@material-ui/core/CssBaseline';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import OrderDisplay from './OrderDisplay';
import SkeletonPageTemplate from './SkeletonPageTemplate';
import CarrierData from './CarrierData';

class Home extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      items: [],
    };
  }

  componentDidMount() {
    this.fetchOrders();
  }

  fetchOrders() {
    console.log('in fetchOrders');

    const sessionToken = sessionStorage.getItem("sessionToken");

    var headers = new Headers({ "Authorization": "Bearer " + sessionToken });

    fetch("/products", { headers })
      .then(response => response.json())
      .then(data => {
        var products = data.products;

        if (products === undefined || products.length == 0) {
          this.setState({
            isLoaded: true,
            error: true,
          });
        } else {
          console.log('in else');
          this.setState({
            isLoaded: true,
            items: products
          });
        }
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    )
  }

  handleRefresh() {
    this.setState({
      isLoaded: false,
      error: null,
    });
    this.fetchOrders();
  }

  render () {
    console.log('in render');
    const { shopOrigin } = this.props;
    const { error, isLoaded, items } = this.state;

    console.log(items);

    let content;

    if (error) {
      content = (
        <div>
          <Alert severity="error" style={{ fontSize: '20px' }}>
            <AlertTitle style={{ fontSize: '20px' }}>Error</AlertTitle>
            Loading error — <strong>Reload</strong>
            <IconButton aria-label="delete" onClick={() => { this.handleRefresh() }}>
              <RefreshIcon />
            </IconButton>
          </Alert>
        </div>
      );
    } else if (!isLoaded) {
      content = <SkeletonPageTemplate fullWidth />
    } else {
      content = (
        <OrderDisplay rows={items} />
      );
    }

    return (
      <div style={{ fontSize: '20px' }}>
        <CssBaseline />
        <AppProvider i18n={enTranslations}>
          {content}
        </AppProvider>
      </div>
    );
  }
}

Home.propTypes = {
  shopOrigin: PropTypes.string
};

export default Home

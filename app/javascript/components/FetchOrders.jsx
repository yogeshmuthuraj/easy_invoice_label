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

class FetchOrders extends React.PureComponent {
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
    const sessionToken = sessionStorage.getItem("sessionToken");
    var headers = new Headers({ "Authorization": "Bearer " + sessionToken });

    fetch("/orders", { headers })
      .then(response => response.json())
      .then(data => {
        var orders = data.orders;

        if (orders === undefined || orders.length == 0) {
          this.setState({
            isLoaded: true,
            error: true,
          });
        } else {
          this.setState({
            isLoaded: true,
            items: orders
          });
        }
      },
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

    let content;

    if (error) {
      content = (
        <Page fullHeight>
          <Card>
            <Alert severity="error" style={{ fontSize: '20px' }}>
              <AlertTitle style={{ fontSize: '20px' }}>Error</AlertTitle>
              Loading error — <strong>Reload</strong>
              <IconButton aria-label="delete" onClick={() => { this.handleRefresh() }}>
                <RefreshIcon />
              </IconButton>
            </Alert>
          </Card>
        </Page>
      );
    } else if (!isLoaded) {
      content = <SkeletonPageTemplate fullWidth />
    } else {
      content = (
        <OrderDisplay rows={items} from="fetchOrders" />
      );
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}

FetchOrders.propTypes = {
  shopOrigin: PropTypes.string
};

export default FetchOrders

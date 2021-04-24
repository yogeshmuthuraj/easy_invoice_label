import React from "react"
import PropTypes from "prop-types"

import '@shopify/polaris/dist/styles.css';
import { AppProvider, Page, Card } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';

import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

import OrderDisplay from './OrderDisplay';
import SkeletonPageTemplate from './SkeletonPageTemplate';

class Home extends React.Component {
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

  initToken() {
    document.addEventListener("DOMContentLoaded", async function() {
      var SessionToken = window["app-bridge"].actions.SessionToken
      var app = window.app;

      app.dispatch(
        SessionToken.request(),
      );

      // Save a session token for future requests
      window.sessionToken = await new Promise((resolve) => {
        app.subscribe(SessionToken.ActionType.RESPOND, (data) => {
          resolve(data.sessionToken || "");
        });
      });

      sessionStorage.setItem("sessionToken", window.sessionToken);
      console.log('window.sessionToken: ', window.sessionToken);
    });
  }

  fetchOrders() {
    this.setState({
      isLoaded: false,
      error: null,
    });

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

  async handleRefresh() {
    await this.initToken();
    await this.fetchOrders();
  }

  render () {
    console.log('in render');
    const { shopOrigin } = this.props;
    const { error, isLoaded, items } = this.state;

    console.log(items);

    let content;

    if (error) {
      content = (
        <div >
          <Alert severity="error" style={{ fontSize: '20px' }}>
            Loading error
            <IconButton aria-label="delete" onClick={() => { this.handleRefresh() }}>
              <RefreshIcon />
            </IconButton>
          </Alert>
        </div>
      );
    } else if (!isLoaded) {
      content = <SkeletonPageTemplate />
    } else {
      content = (
        <OrderDisplay rows={items} />
      );
    }

    return (
      <div style={{ fontSize: '20px' }}>
        <AppProvider i18n={enTranslations}>
          <Page title="Choose orders" fullWidth fullHeight>
            <Card sectioned>
              {content}
            </Card>
          </Page>
        </AppProvider>
      </div>
    );
  }
}

Home.propTypes = {
  shopOrigin: PropTypes.string
};

export default Home

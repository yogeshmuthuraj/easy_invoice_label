import React from "react"
import PropTypes from "prop-types"
import '@shopify/polaris/dist/styles.css';
import enTranslations from '@shopify/polaris/locales/en.json';
import { AppProvider, Page, Card, Button } from '@shopify/polaris';
import { Button } from '@material-ui/data-grid';
import RefreshIcon from '@material-ui/icons/Refresh';

import OrderDisplay from './OrderDisplay'
import SkeletonPageTemplate from './SkeletonPageTemplate'

class Home extends React.Component {
  constructor(props) {
    super(props);

    const sessionToken = sessionStorage.getItem("sessionToken");

    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      sessionToken,
    };
  }

  componentDidMount() {
    this.fetchOrders();
  }

  fetchOrders() {
    var headers = new Headers({ "Authorization": "Bearer " + this.state.sessionToken });

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

  render () {
    console.log('in render');
    const { shopOrigin } = this.props;
    const { error, isLoaded, items } = this.state;

    console.log(items);

    let content;


    if (error) {
      content = (
        <div>
          Error:
          <Button
            variant="contained" color="primary" onClick={() => { this.fetchOrders() }}
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
        </div>
      );
    } else if (!isLoaded) {
      content = <SkeletonPageTemplate />
    } else {
      content = (
        <OrderDisplay rows={items} isLoaded={isLoaded} />
      );
    }

    return (
      <AppProvider i18n={enTranslations}>
        <Page title="Choose orders" fullWidth>
          <Card sectioned>
            {content}
          </Card>
        </Page>
      </AppProvider>
    );
  }
}

Home.propTypes = {
  shopOrigin: PropTypes.string
};

export default Home

import React from "react"
import PropTypes from "prop-types"
import '@shopify/polaris/dist/styles.css';
import enTranslations from '@shopify/polaris/locales/en.json';
import {AppProvider, Page, Card, Button, DataTable} from '@shopify/polaris';

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

  fetchOrders() {

    console.log("fetch");
    console.log(this.state.sessionToken);
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

  componentDidMount() {
    this.fetchOrders();
  }

  render () {
    console.log('in render');
    const { error, isLoaded, items } = this.state;

    console.log(items);

    const rows = [
      ['123', '345'],
      ['123', '345'],
      ['123', '345'],
      ['123', '345'],
    ]
    if (error) {
      return <div>Error:</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <AppProvider i18n={enTranslations}>
          <Page title="Example app">
            <Card sectioned>
              <Button onClick={() => alert('Button clicked!')}>Example button</Button>
              <ul>
                {
                  items.forEach((product) => {
                    var link = `<a target="_top" href="https://<%= @shop_origin %>/admin/products/${product.id}">`;
                    // console.log(product);
                    <li key={product.id}>
                      {link} {product.title}
                    </li>
                  })
                }
              </ul>
              <DataTable
                columnContentTypes={[
                  'text',
                  'numeric',
                ]}
                headings={[
                  'Product',
                  'Price',
                ]}
                rows={rows}
              />
            </Card>
          </Page>
        </AppProvider>
      );
    }
  }
}

Home.propTypes = {
  greeting: PropTypes.string
};
export default Home

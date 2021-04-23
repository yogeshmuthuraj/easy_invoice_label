import React from "react"
import PropTypes from "prop-types"

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

    if (error) {
      return <div>Error:</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <ul>
          {
            items.forEach((product) => {
              var link = `<a target="_top" href="https://<%= @shop_origin %>/admin/products/${product.id}">`;
              console.log(product);
              <li key={product.id}>
                {link} {product.title}
              </li>
            })
          }
        </ul>
      );
    }
  }
}

Home.propTypes = {
  greeting: PropTypes.string
};
export default Home

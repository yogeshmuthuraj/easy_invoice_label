import React from "react"
import PropTypes from "prop-types"
class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  tokenInit() {

  }

  fetchOrders() {

    console.log("fetch");
    // console.log(windowSessionToken);
    var headers = new Headers({ "Authorization": "Bearer " + window.sessionToken });

    fetch("/products", { headers })
      .then(response => response.json())
      .then(result => {
        console.log("result");
        console.log(result);
        var result = result.products;

        this.setState({
          isLoaded: true,
          items: result.items
        });
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
    this.tokenInit();
    this.fetchOrders();
  }

  render () {
    const { error, isLoaded, items } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <ul>
          {items.map(item => (
            <li key={item.id}>
              {item.name} {item.price}
            </li>
          ))}
        </ul>
      );
    }
  }
}

Home.propTypes = {
  greeting: PropTypes.string
};
export default Home

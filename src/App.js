import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import Amplify, { API, Auth } from "aws-amplify";
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

import aws_exports from "./aws-exports";
import HeaderMenu from "./components/HeaderMenu";
import OrderList from "./components/OrderList";
import MyOrders from "./components/MyOrders";

Amplify.configure(aws_exports);

const APINAME = "deliveryAPI";
let path = "/deliver";

class App extends Component {
  async componentDidMount() {
    API.get(APINAME, path, {
      headers: { "X-Amz-Security-Token": `${await this.getToken()}` },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getToken = async () =>
    (await Auth.currentSession()).getIdToken().getJwtToken();

  render() {
    return (
      <div className="App">
        <Router>
        <AmplifySignOut />
          <HeaderMenu />

          <Route path="/" exact render={() => <OrderList />} />

          <Route path="/my-orders" exact render={() => <MyOrders />} />
        </Router>
      </div>
    );
  }
}
export default withAuthenticator(App);

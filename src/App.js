import "./App.css";

import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { geolocated } from "react-geolocated";

import Amplify, { API, Auth, Storage } from "aws-amplify";
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

import aws_exports from "./aws-exports";
import HeaderMenu from "./components/HeaderMenu";
import OrderList from "./components/OrderList";
import Delivery from "./components/Delivery";

import QrReader from 'react-qr-scanner'

Amplify.configure(aws_exports);

const APINAME = "deliveryAPI";
let path = "/deliver";

class App extends Component {

  constructor() {
    super();

    this.state = {
        orders: [],
        selectedOrder: null,
        loadung: true,
        proof: null
    }
    this.getToken = this.getToken.bind(this);
    this.handleDelivery = this.handleDelivery.bind(this);
    this.handleCapture = this.handleCapture.bind(this);
    this.handleScan = this.handleScan.bind(this)
  }


  componentDidUpdate(prevProps) {    
    if (this.props.coords &&  prevProps.coords === null) {
      // In case we have location permissions.
      console.log({ 'latitude': this.props.coords.latitude, 'longitude': this.props.coords.longitude} )
    }
  }


  async componentDidMount() {
    API.get(APINAME, path, {
      headers: { "X-Amz-Security-Token": `${await this.getToken()}` },
    })
      .then((orderList) => {
        this.setState({
          orders: orderList,
          loading: false
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getToken = async () =>
    (await Auth.currentSession()).getIdToken().getJwtToken();

  
  handleCapture = async (target) => {
    console.log('[handleCapture]', target)
    this.setState({
      loading: true
    }); 
    if (target.files) {
      if (target.files.length !== 0) {
        const file = target.files[0];
        const newUrl = URL.createObjectURL(file);

        let S3Key = null; 
        try {
          S3Key = await Storage.put(file.name, file, {
            contentType: 'image/png' // contentType is optional
          });
        
          
        } catch (err) {
          console.log('Error uploading file: ', err);
        }          


        this.setState({
          loading: false,
          proof: S3Key
        }); 
      }
    }

  };

  handleDelivery = (deliveryRow) => {
    this.setState({
      selectedOrder: deliveryRow
    });

  }

  handleScan(data){
    this.setState({
      result: data,
    })
  }
  handleError(err){
    console.error(err)
  }  

  render() {
    const previewStyle = {
      height: 240,
      width: 320,
    }
    console.log('[App][render]', this.state)
    return (
      <div className="App">
        <Router>
        <AmplifySignOut />
          <HeaderMenu />
          <Delivery order = { this.state.selectedOrder } handleCapture = { (e) => this.handleCapture(e) } /> 

          <Route path="/" exact render={() => <OrderList orders = {this.state.orders } onHandleDelivery = { (e) => this.handleDelivery(e)} />} />
          {
            //this.state.selectedOrder && <Delivery order = { this.state.selectedOrder } handleCapture = { (e) => this.handleCapture(e) } /> 
            this.state.selectedOrder && <QrReader delay="100" style={previewStyle} onError={this.handleError} onScan={this.handleScan} /> 
          }
        </Router>
      </div>
    );
  }
}

export default withAuthenticator(geolocated({
  positionOptions: {
      enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(App));


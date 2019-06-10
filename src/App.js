import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'

import Navbar from './components/Navbar';
import MainContainer from './containers/MainContainer';
import Kitchen from './containers/Kitchen';
import Home from './components/Home';
import Table from './containers/Table';

const BASE_URL = "http://localhost:3000/";
const TABLES_URL = BASE_URL + "tables";
const RECIPES_URL = BASE_URL + "recipes";
const ORDERS_URL = BASE_URL + "orders";
const COOK_SESSIONS_URL = BASE_URL + "cook_sessions";

class App extends Component {

  state = {
    table: null, // starting with just one table
    orders: null,
    recipes: null
  }

  componentDidMount() {
    fetch(TABLES_URL)
    .then(res => res.json())
    .then(tablesData => {
      let ordersData = [];
      tablesData.forEach(table => {
        for (var i = 0; i < table.orders.length; i++) {
          ordersData.push(table.orders[i]);
        }
      });
      this.setState({
        table: tablesData[0],
        orders: ordersData
      });
    })

    fetch(RECIPES_URL)
    .then(res => res.json())
    .then(recipesData => {
      this.setState({ recipes: recipesData })
    })
  }

  placeOrder = (itemName) => {
    let formData = {
      item_name: itemName,
      user_id: 1,
      served: false,
      price: Math.floor(Math.random() * 25 + 5),
      table_id: 1
    };

    let configObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    };

    fetch(ORDERS_URL, configObj)
      .then(res => res.json())
      .then(order => {
        console.log(order);
      })
      .catch(error => {
        console.log(error.message);
      })
  }

  createCookSession = (orderInfo, potId) => {
    let formData = {
      order: orderInfo,
      pot_id: potId
    }

    let configObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    }

    fetch(COOK_SESSIONS_URL, configObj)
      .then(res => res.json())
      .then(cookSession => {
        console.log(cookSession);
      })
      .catch(error => {
        console.log(error.message);
      })
  }

  deleteCookSession = (sessionId) => {
    fetch(`${COOK_SESSIONS_URL}/${sessionId}`, { method: "DELETE" })
  }

  completeCookSession = (sessionId) => {
    let formData = {
      id: sessionId,
      completed: true
    };

    let configObj = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    };

    fetch(`${COOK_SESSIONS_URL}/${sessionId}`, configObj)
  }

  render() {
    // console.log("App state: ", this.state);
    return (
      <React.Fragment>
        <Navbar />
        <Switch>
          {/*<Route path="/main" render={routerProps => <MainContainer {...routerProps} tables={this.state.tables} /> } /> */}
          <Route path="/table" render={routerProps => <Table {...routerProps} table={this.state.table} recipes={this.state.recipes} placeOrder={this.placeOrder}/>} />
          <Route
            path="/kitchen"
            render={ routerProps =>
                <Kitchen {...routerProps}
                orders={this.state.orders}
                createCookSession={this.createCookSession}
                deleteCookSession={this.deleteCookSession}
                completeCookSession={this.completeCookSession}
              />
            } />
          <Route exact path="/" component={Home} />
        </Switch>
      </React.Fragment>
    );
  }

}

export default App;

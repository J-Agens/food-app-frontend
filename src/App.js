import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from './actions/userActions'
// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'

import Navbar from './components/Navbar';
import TablesList from './containers/TablesList';
import Kitchen from './containers/Kitchen';
import Home from './components/Home';
import Table from './containers/Table';

export const BASE_URL = "http://localhost:3000/";
export const TABLES_URL = BASE_URL + "tables";
const RECIPES_URL = BASE_URL + "recipes";
const ORDERS_URL = BASE_URL + "orders";
const COOK_SESSIONS_URL = BASE_URL + "cook_sessions";

class App extends Component {

  state = {
    table: null, // starting with just one table --> not currently in use anymore, should delete
    tables: null,
    orders: null,
    recipes: null,
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token && !this.props.user) {
      fetch('http://localhost:3000/auto_login', {
        headers: {
          Authorization: `${token}`
        }
      })
        .then(res => res.json())
        .then(user => {
          console.log(user);
          if (!user.errors) {
            this.props.login(user);
          }
        })
    }

    this.loadTablesAndOrders();

    fetch(RECIPES_URL)
    .then(res => res.json())
    .then(recipesData => {
      this.setState({ recipes: recipesData })
    })
  }

  loadTablesAndOrders = () => {
    // Maybe need to relocate or abstract futher
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
        tables: tablesData,
        orders: ordersData
      });
    })
  }

  placeOrder = (orderObj) => {
    let formData = {
      item_name: orderObj.itemName,
      user_id: this.props.user.id,
      served: false,
      // price: Math.floor(Math.random() * 25 + 5),
      price: 1,
      table_id: orderObj.tableId
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
      .then(() => {
        this.loadTablesAndOrders();
      })
      .catch(error => {
        console.log(error.message);
      })
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

  postOrderToBoard = (order) => {
    this.setState(prevState => {
      return {
        orders: [...prevState.orders, order]
      }
    });
  }

  unpinOrderFromBoard = (order) => {
    const filtered = this.state.orders.filter(odr => odr.id !== order.id);
    console.log("serveOrderToTable => filtered: ", filtered);
    this.setState({ orders: [...filtered, order] });
  }

  postOrderToTable = (order) => {
    this.setState(prevState => {
      const filtered = prevState.orders.filter(ord => ord.id !== order.id);
      return {
        orders: [...filtered, order]
      };
    });
  }

  serveOrderToTable = (order) => {
    this.setState(prevState => {
      const filtered = prevState.orders.filter(ord => ord.id !== order.id);
      return {
        orders: [...filtered, order]
      };
    });
  }


  render() {
    console.log("APP STATE: ", this.state);
    console.log("App state.orders: ", this.state.orders);
    // console.log("App state table: ", this.state.table);
    console.log("APP state.tables: ", this.state.tables);
    return (
      <div>
      { !!this.props.user ?
      <React.Fragment>
        <Navbar loadTablesAndOrders={this.loadTablesAndOrders}/>
        <Switch>
          <Route
            exact path="/tables"
            render={routerProps =>
              <TablesList {...routerProps}
                loadTablesAndOrders={this.loadTablesAndOrders}
                tables={this.state.tables}
                orders={this.state.orders}
              /> }
          /> }
          <Route
            path="/tables/:tableId"
            render={routerProps =>
              <Table {...routerProps}
                table={!!this.state.tables ? this.state.tables[routerProps.match.params.tableId - 1] : null}
                orders={this.state.orders}
                recipes={this.state.recipes}
                placeOrder={this.placeOrder}
                postOrderToTable={this.postOrderToTable}
                serveOrderToTable={this.serveOrderToTable}
                />
            } />
          <Route
            path="/kitchen"
            render={ routerProps =>
                <Kitchen {...routerProps}
                loadTablesAndOrders={this.loadTablesAndOrders}
                orders={this.state.orders}
                completeCookSession={this.completeCookSession}
                postOrderToBoard={this.postOrderToBoard}
                unpinOrderFromBoard={this.unpinOrderFromBoard}
              />
            } />
          <Route exact path="/" render={routerProps =>
            <Home {...routerProps}
              loadTablesAndOrders={this.loadTablesAndOrders}
            /> }
          />
        </Switch>
      </React.Fragment>
    : <div className="container-fluid" id="home-container">
        <Home />
      </div>
    }
  </div> // had to wrap to test login
    );
  }

}

const mapStateToProps = state => {
  console.log("APP STATE from REDUX: ", state);
  return {
    user: state.usersReducer.user
  }
}

export default connect(mapStateToProps, { login })(App);

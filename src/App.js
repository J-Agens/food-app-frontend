import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from './actions/userActions'
import { ActionCableConsumer } from 'react-actioncable-provider';
// import logo from './logo.svg';
import './App.css';

import NavComponent from './components/NavComponent';
import TablesList from './containers/TablesList';
import Kitchen from './containers/Kitchen';
import Home from './components/Home';
import Table from './containers/Table';

import money from './prices/recipes';

export const BASE_URL = "http://localhost:3000/";
export const TABLES_URL = BASE_URL + "tables";
const RECIPES_URL = BASE_URL + "recipes";
const ORDERS_URL = BASE_URL + "orders";
const COOK_SESSIONS_URL = BASE_URL + "cook_sessions";
export const USERS_URL = BASE_URL + "users"

class App extends Component {

  state = {
    // table: null, // starting with just one table --> not currently in use anymore, should delete
    tables: null,
    orders: null,
    recipes: null,
    wallet: 0
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
            this.setState({ wallet: user.wallet })
          }
        })
      this.loadTablesAndOrders();
    }



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

  setWallet = (userObj) => {
    this.setState({ wallet: userObj.wallet });
  }

  placeOrder = (orderObj) => {
    let formData = {
      item_name: orderObj.itemName,
      user_id: this.props.user.id,
      served: false,
      // price: Math.floor(Math.random() * 25 + 5),
      price: money[orderObj.itemName],
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
      .then(order => {

          console.log("ORDER!!!:",order);
      })
      .then(() => {
        this.loadTablesAndOrders();
      })
      .catch(error => {
        console.log(error.message);
      })
  }

  cancelOrder = (orderObj) => {

    let formData = {
      id: orderObj.id
    }

    let configObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    };

    fetch(`${BASE_URL}cancel`, configObj)
      // .then(res => res.json())
      // .then(orderData => {
      //   console.log("orderData: ", orderData);
      //   // this.setState(prevState => {
      //   //   const filtered = prevState.orders.filter(o => o.id !== orderData.id);
      //   //   return {
      //   //     orders: filtered
      //   //   }
      //   // });
      // })
      .catch(error => {
        console.log("error in deleting order, ", error);
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

  // unpinOrderFromBoard = (order) => {
  //   const filtered = this.state.orders.filter(odr => odr.id !== order.id);
  //   console.log("serveOrderToTable => filtered: ", filtered);
  //   this.setState({ orders: [...filtered, order] });
  // }

  // postOrderToTable = (order) => {
  //   this.setState(prevState => {
  //     const filtered = prevState.orders.filter(ord => ord.id !== order.id);
  //     return {
  //       orders: [...filtered, order]
  //     };
  //   });
  // }

  serveOrderToTable = (order) => {
    this.setState(prevState => {
      const filtered = prevState.orders.filter(ord => ord.id !== order.id);
      return {
        orders: [...filtered, order]
      };
    });
  }


  payBill = (userId) => {
    let formData = {
      id: userId
    };
    let configObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(formData)
    };
    fetch("http://localhost:3000/pay_bill", configObj)
      .then(res => res.json())
      .then(data => {
        console.log("data: ", data);
        this.setState(prevState => {
          const newWallet = prevState.wallet - data.total
          return {
            wallet: newWallet
          }
        });
      })
      .catch(error => {
        console.log("pay_bill error: ", error);
      })
  }

  removePaidOrders = (orderIds) => {
    this.setState(prevState => {
      const filtered = this.state.orders.filter(ord => !orderIds.includes(ord.id))
      return {
        orders: filtered
      }
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
        <ActionCableConsumer
          channel={{channel: "PayChannel"}}
          onReceived={(info) => {
            console.log('info was recieved', info);
            this.removePaidOrders(info.order_ids);
            // this.loadTablesAndOrders();
          }}
        />
        <ActionCableConsumer
          channel={{channel: "TablesChannel"}}
          onReceived={(order) => {
            console.log("order was served", order);
            this.serveOrderToTable(order);
          }}
        />
        <ActionCableConsumer
            channel={{channel: "OrderBoardChannel"}}
            onReceived={(order) => {
              console.log('order was recieved', order);
              this.postOrderToBoard(order);
              // this.props.loadTablesAndOrders();
            }}
          />
        <NavComponent loadTablesAndOrders={this.loadTablesAndOrders}/>
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
                loadTablesAndOrders={this.loadTablesAndOrders}
                recipes={this.state.recipes}
                placeOrder={this.placeOrder}
                cancelOrder={this.cancelOrder}
                postOrderToTable={this.postOrderToTable}
                serveOrderToTable={this.serveOrderToTable}
                wallet={this.state.wallet}
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
              orders={this.state.orders}
              payBill={this.payBill}
              setWallet={this.setWallet}
              wallet={this.state.wallet}
            /> }
          />
        </Switch>
      </React.Fragment>
    :
      <Home loadTablesAndOrders={this.loadTablesAndOrders} setWallet={this.setWallet}/>
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

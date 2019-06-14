import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ActionCableConsumer } from 'react-actioncable-provider';

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.includes(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr;
}

class TableCard extends Component {

  state = {
    // REALLY NEEDS TO BE ADJUSTED SO THAT ORDERS ARE THE SINGLE
    // SOURCE OF TRUTH RATHER THAN TABLES
    // usersAtTable: this.props.table.active_users_at_table
    usersAtTable: [],
    total: 0
  }

  componentDidMount() {
    this.setState({
      usersAtTable: this.props.activeUsers(this.props.table),
      total: this.props.total(this.props.table)
    });
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   // do things with nextProps.someProp and prevState.cachedSomeProp
  //   // nextProps.loadTablesAndOrders();
  // }

  // componentWillUpdate() {
  //   console.log("CWU");
  //   // this.props.loadTablesAndOrders();
  // }
  // shouldComponentUpdate(nextProps, nextState) {
  //   return ( this.props.table !== nextProps.table )
  // }

  // ORDERS FUNCTIONS

  // tableOrders = () => {
  //   return this.props.orders.filter(order => order.table_id === this.props.table.id);
  // }
  //
  // tableTotal = () => {
  //   let tableOrderPrices = this.tableOrders().map(order => order.price);
  //   const reducer = (accumulator, currValue) => accumulator + currValue;
  //   if (tableOrderPrices.length > 0) {
  //     return tableOrderPrices.reduce(reducer);
  //   } else {
  //     return null;
  //   }
  // }
  //
  // tableActiveOrders = () => {
  //   return this.tableOrders().filter(order => order.served === false)
  // }
  //
  // tableActiveUsers = () => {
  //   return this.tableActiveOrders().map(order => order.customer).unique();
  // }

  generateUsersAtTable = () => {
    return this.state.usersAtTable.map((user, idx) => {
      return <li key={idx}>{user}</li>
    });
  }

  // SINGLE SOURCE OF TRUTH SHOULD BE ORDERS
  addUserByOrder = (order) => {
    if (!this.state.usersAtTable.includes(order.customer) && order.table_id === this.props.table.id) {
      this.setState(prevState => {
        return {
          usersAtTable: [...prevState.usersAtTable, order.customer]
        }
      });
    }
  }

  incrementTotalByOrder = (order) => {
    if (this.state.usersAtTable.includes(order.customer)) {
      this.setState(prevState => {
        return {
          total: prevState.total + order.price
        }
      })
    }
  }

  render() {
    console.log("TableCard state: ", this.state);
    console.log("tableActiveOrders", this.props.activeOrders);
    console.log("tableActiveUsers", this.props.activeUsers);
    console.log("tableTotal", this.props.total);
    return (
      <div className="col-3 table-card">
        <ActionCableConsumer
          channel={{channel: "OrderBoardChannel"}}
          onReceived={(order) => {
            console.log('order was recieved to TABLECARD', order);
            this.addUserByOrder(order);
            this.incrementTotalByOrder(order);
          }}
        />
      <h4><Link to={`/tables/${this.props.table.id}`}>Table {this.props.table.id} | ${this.state.total > 0 ? this.state.total : 0}</Link></h4>
        <hr />
        <ul>
          {this.generateUsersAtTable()}
        </ul>
      </div>
    )
  }

}

export default TableCard;

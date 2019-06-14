import React, { Component } from 'react'
import TableCard from '../components/TableCard';
// TRANSFERED FROM TABLECARD
Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.includes(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr;
}

class TablesList extends Component {

  componentDidMount() {
    this.props.loadTablesAndOrders();
  }

  // TRANSFERED FROM TABLECARD //
  tableOrders = (table) => {
    console.log("tableOrders props", this.props);
    return this.props.orders.filter(order => order.table_id === table.id);
  }

  tableTotal = (table) => {
    let tableOrderPrices = this.tableOrders(table).map(order => order.price);
    const reducer = (accumulator, currValue) => accumulator + currValue;
    if (tableOrderPrices.length > 0) {
      return tableOrderPrices.reduce(reducer);
    } else {
      return null;
    }
  }

  tableActiveOrders = (table) => {
    return this.tableOrders(table).filter(order => order.served === false)
  }

  tableActiveUsers = (table) => {
    return this.tableActiveOrders(table).map(order => order.customer).unique();
  }
  /////////////////////////////////

  generateTableCards = () => {
    return this.props.tables.map(table => {
      return (
        <TableCard
          key={table.id}
          loadTablesAndOrders={this.props.loadTablesAndOrders}
          table={table}
          orders={(t) => this.tableOrders(t)}
          total={(t) => this.tableTotal(t)}
          activeUsers={(t) => this.tableActiveUsers(t)}
          activeOrders={(t) => this.tableActiveOrders(t)}
        />
      )
    });
  }

  render() {
    console.log("Main Container tables: ", this.props.tables);
    return (
      <div className="container">
        <div className="row justify-content-center">
          { !!this.props.tables ? this.generateTableCards() : null }
        </div>
      </div>
    )
  }
}

export default TablesList;

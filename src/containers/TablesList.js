import React, { Component } from 'react'
import TableCard from '../components/TableCard';
// // TRANSFERED FROM TABLECARD
// Array.prototype.unique = function() {
//     var arr = [];
//     for(var i = 0; i < this.length; i++) {
//         if(!arr.includes(this[i])) {
//             arr.push(this[i]);
//         }
//     }
//     return arr;
// }

class TablesList extends Component {

  componentDidMount() {
    this.props.loadTablesAndOrders();
  }

  generateTableCards = () => {
    return this.props.tables.map(table => {
      return (
        <TableCard
          key={table.id}
          loadTablesAndOrders={this.props.loadTablesAndOrders}
          table={table}
          orders={this.props.orders}
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

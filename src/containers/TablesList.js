import React, { Component } from 'react'
import TableCard from '../components/TableCard';
class TablesList extends Component {

  generateTableCards = () => {
    return this.props.tables.map(table => {
      return <TableCard key={table.id} table={table} />
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

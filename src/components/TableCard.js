import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class TableCard extends Component {

  generateUsersAtTable = () => {
    return this.props.table.active_users_at_table.map((user, idx) => {
      return <li key={idx}>{user}</li>
    });
  }

  render() {
    return (
      <div className="col-3 table-card">
        <h4><Link to={`/tables/${this.props.table.id}`}>Table {this.props.table.id} | ${this.props.table.table_total}</Link></h4>
        <hr />
        <ul>
          {this.generateUsersAtTable()}
        </ul>
      </div>
    )
  }

}

export default TableCard;

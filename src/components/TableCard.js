import React, { Component } from 'react';

class TableCard extends Component {

  state = {

  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="col-md-4"><h4>Table {this.props.table.id}</h4></div>
    )
  }

}

export default TableCard;

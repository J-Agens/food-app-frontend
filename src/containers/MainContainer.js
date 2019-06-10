import React, { Component } from 'react'
import TableCard from '../components/TableCard';
import { Route, Link } from 'react-router-dom';
import Table from './Table';
class MainContainer extends Component {


  render() {
    console.log("Main Container tables: ", this.props.tables);
    return (
      <div className="container">
        <div className="row">
          <h3>Placeholder for Tables List</h3>
        </div>
      </div>
    )
  }
}

export default MainContainer;

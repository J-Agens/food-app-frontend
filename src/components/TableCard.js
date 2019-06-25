import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ActionCableConsumer } from 'react-actioncable-provider';
import { connect } from 'react-redux';
import ListGroup from 'react-bootstrap/ListGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faChair } from '@fortawesome/free-solid-svg-icons'

import { BASE_URL, TABLES_URL } from '../App';

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
    usersAtTable: [],
    total: 0
  }

  componentDidMount() {
    // this.props.loadTablesAndOrders();
    this.setState({
      usersAtTable: this.tableActiveUsers(),
      total: this.tableTotal()
    });

    // NEW //
    fetch(`${TABLES_URL}/${this.props.table.id}`)
      .then(res => res.json())
      .then(table => {
        this.setState({
          usersAtTable: table.active_users_at_table,
          total: table.table_total
        });
      })
      .catch(error => {
        console.log(error);
      })
  }

  // ORDERS FUNCTIONS
  tableOrders = () => {
    return this.props.orders.filter(order => order.table_id === this.props.table.id);
  }

  tableTotal = () => {
    let tableOrderPrices = this.tableOrders().map(order => order.price);
    const reducer = (accumulator, currValue) => accumulator + currValue;
    if (tableOrderPrices.length > 0) {
      return tableOrderPrices.reduce(reducer);
    } else {
      return null;
    }
  }

  tableActiveOrders = () => {
    return this.tableOrders().filter(order => order.served === false)
  }

  tableActiveUsers = () => {
    return this.tableActiveOrders().map(order => order.customer).unique();
  }

  generateUsersAtTable = () => {
    return this.state.usersAtTable.map((user, idx) => {
      if (user === this.props.user.username) {
        return <ListGroup.Item className="tablecard-li user-tablecard-li" key={idx}><FontAwesomeIcon className="user-fa-user" icon={faUser} /> {"   " + user}</ListGroup.Item>
      } else {
        return <ListGroup.Item className="tablecard-li" key={idx}><FontAwesomeIcon icon={faUser} />{"   " + user}</ListGroup.Item>
      }
    });
  }

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
    console.log("TABLECARD STATE: ", this.state);
    return (
      <div className="col-md-3 table-card">
        <ActionCableConsumer
          channel={{channel: "OrderBoardChannel"}}
          onReceived={(order) => {
            console.log('order was recieved to TABLECARD', order);
            this.addUserByOrder(order);
            this.incrementTotalByOrder(order);
          }}
        />
       <ActionCableConsumer
          channel={{channel: "TablesChannel"}}
          onReceived={(order) => {
            console.log("order was served", order);
            fetch(`${TABLES_URL}/${this.props.table.id}`)
              .then(res => res.json())
              .then(table => {
                this.setState({
                  usersAtTable: table.active_users_at_table,
                  total: table.table_total
                })
              })
          }}
        />
      <ActionCableConsumer
        channel={{channel: "PayChannel"}}
        onReceived={(info) => {
          console.log('bill was paid', info);
          this.setState({
            usersAtTable: this.tableActiveUsers(),
            total: this.tableTotal()
          })
        }}
      />
      <h4 className="chair-link"><Link to={`/tables/${this.props.table.id}`}><FontAwesomeIcon icon={faChair}/></Link></h4>
      <h1 className="watermark"><sup className="watermark-symbol">$</sup>{this.state.total > 0 ? this.state.total : 0}</h1>
        <ListGroup varient="flush">
          {this.generateUsersAtTable()}
        </ListGroup>
      </div>
    )
  }

}

const mapStateToProps = state => {
  return {
    user: state.usersReducer.user
  }
}

export default connect(mapStateToProps)(TableCard);

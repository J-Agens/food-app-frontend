import React, { Component } from 'react';
import Login from './Login';
import Signup from './Signup';
import { connect } from 'react-redux';

class Home extends Component {

  generateOrders = () => {
    return this.props.user.orders.map(order => {
      return <li style={order.served ? {color: "green"} : {color: "black"}}key={order.id}>{order.item_name} - ${order.price}</li>
    });
  }

  render() {
    console.log("HOME USER : ", this.props.user);
    return (
      <React.Fragment>
      { !this.props.user ?
      <div className="row">
        <div className="col-6"><Login /></div>
        <div className="col-6"><Signup /></div>
      </div>
      :
      <div className="row justify-content-center">
        <div className="col-6">
          <h3>You are logged in, {this.props.user.username}</h3>
          <h4>Total: ${this.props.user.personal_total}</h4>
          <h5>Orders:</h5>
          <ul>
            {this.generateOrders()}
          </ul>
        </div>
      </div>
      }
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.usersReducer.user
  }
}

export default connect(mapStateToProps)(Home);

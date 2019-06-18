import React, { Component } from 'react';
import Login from './Login';
import Signup from './Signup';
import { connect } from 'react-redux';
import { BASE_URL, USERS_URL } from '../App';

class Home extends Component {

  state = {
    total: 0
  }

  componentDidMount() {
    // this.props.loadTablesAndOrders();
    if (!!this.props.user) {
      fetch(`${USERS_URL}/${this.props.user.id}`)
      .then(res => res.json())
      .then(userData => {
        this.setState({
          total: userData.personal_total
        });
        this.props.setWallet(userData)
      })
    }
  }

  generateOrders = () => {
    const userOrders = this.props.orders.filter(ord => ord.user_id === this.props.user.id);
    return userOrders.map(order => {
      return <li style={order.served ? {color: "green"} : {color: "black"}}key={order.id}>{order.item_name} - ${order.price}</li>
    });
  }

  userTotal = () => {
    console.log("HOME: USERTOTAL: PROPS: ", this.props);
    const userOrders = this.props.orders.filter(ord => ord.user_id === this.props.user.id);
    const prices = userOrders.map(order => order.price);
    const reducer = (accumulator, currValue) => accumulator + currValue;
    if (prices.length > 0) {
      return prices.reduce(reducer);
    } else {
      return null;
    }
  }

  handlePayBillClick = () => {
    this.props.payBill(this.props.user.id);
    this.setState({ total: 0 })
  }

  render() {
    // console.log("HOME PROPS : ", this.props);
    // console.log("HOME STATE : ", this.state);
    return (
      <React.Fragment>
      { !this.props.user ?
      <div className="row">
        <div className="col-6"><Login /></div>
        <div className="col-6"><Signup loadTablesAndOrders={this.props.loadTablesAndOrders}/></div>
      </div>
      :
      <div className="row justify-content-center">
        <div className="col-6">
          <h3>You are logged in, {this.props.user.username}</h3>
          <h5>Wallet: ${this.props.wallet}</h5>
          <h4>Total: ${this.state.total} |<button className="btn" onClick={this.handlePayBillClick}>Pay Bill</button></h4>
          <h5>Orders:</h5>
          <ul>
            {this.props.orders ? this.generateOrders() : null}
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

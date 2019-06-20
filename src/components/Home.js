import React, { Component } from 'react';
import Login from './Login';
import Signup from './Signup';
import { connect } from 'react-redux';
import { BASE_URL, USERS_URL } from '../App';
import { ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faReceipt, faCashRegister } from '@fortawesome/free-solid-svg-icons'

class Home extends Component {

  state = {
    total: 0
  }

  componentDidMount() {
    // Added conditional to fix bug that would occur when a user tries to
    // pay bill upon initial login
    this.props.loadTablesAndOrders();

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
      // return <li style={order.served ? {color: "green"} : {color: "black"}}key={order.id}>{order.item_name} - ${order.price}</li>
      return <ListGroup.Item className="home-order" style={order.served ? {color: "#49E7A5", backgroundColor: "#90C4AF"} : {color: "#1E201F"}} key={order.id}>{order.item_name} - ${order.price}</ListGroup.Item>
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

      <div className="container">
        { !this.props.user ?
        <div className="row">
          <div className="col-6"><Login /></div>
          <div className="col-6"><Signup loadTablesAndOrders={this.props.loadTablesAndOrders}/></div>
        </div>
        :
        <React.Fragment>
          <div className="row top-row">
            <div className="col-6">
              {/*<h3>You are logged in, {this.props.user.username}</h3> */}
              <h5 style={this.props.wallet < 0 ? {color: "red"} : null }><FontAwesomeIcon icon={faWallet} size="6x"/> <span className="user-stat">  ${this.props.wallet}</span></h5>
            </div>
            <div className="col-6">
              <h5><FontAwesomeIcon icon={faReceipt} size="6x" onClick={() => {console.log("clicked receipt")}}/> <span className="user-stat">  ${this.state.total}</span></h5>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <h5><FontAwesomeIcon icon={faCashRegister} size="6x"/></h5>
              <button className="btn" onClick={this.handlePayBillClick}>Pay Bill</button>
            </div>
            <div className="col-6">
              {/*<h5 className="user-stat">Orders</h5>*/}
              <ListGroup>
                {this.props.orders ? this.generateOrders() : null}
              </ListGroup>
            </div>
          </div>
        </React.Fragment>
        }
      </div>

    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.usersReducer.user
  }
}


export default connect(mapStateToProps)(Home);

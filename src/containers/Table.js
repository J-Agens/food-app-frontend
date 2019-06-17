import React, { Component, Fragment } from 'react';
import { ActionCableConsumer } from 'react-actioncable-provider';
import { connect } from 'react-redux';

class Table extends Component {

  componentDidMount() {
    this.props.loadTablesAndOrders();
  }

  // Had to make orders the single source of truth for multiple tables ironically
  tableOrders = () => {
    return this.props.orders.filter(order => order.table_id === this.props.table.id);
  }

  handleCancelClick = (order) => {
    this.props.cancelOrder(order);
    console.log("delete order event handler (not working yet)");
  }

  generatePlacedOrders = () => {
    const placedOrders = this.tableOrders().filter(order => order.served === false);
    return placedOrders.map(order => {
      if (order.user_id === this.props.user.id) {
        return <li className="placed-order user-placed-order" onClick={() => this.handleCancelClick(order)} key={order.id}>{order.item_name}</li>
      } else {
        return <li className="placed-order" key={order.id}>{order.item_name}</li>
      }
    })
  }

  generateServedOrders = () => {
    const servedOrders = this.tableOrders().filter(order => order.served === true);
    return servedOrders.map(order => {
      if (order.user_id === this.props.user.id) {
        return <li className="served-order user-served-order" key={order.id}>{order.item_name}</li>
      } else {
        return <li className="served-order" key={order.id}>{order.item_name}</li>
      }
    });
  }

  generateMenu = () => {
    return this.props.recipes.map(rec => {
      return <li className="menu-item" onClick={this.handleClick} key={rec.id}>{rec.name}</li>
    })
  }

  handleClick = (e) => {
    this.props.placeOrder({
      itemName: e.target.textContent,
      tableId: this.props.table.id
    });
  }

  render() {
    console.log("TABLE PROPS: ", this.props);
    // , table_id: this.props.match.params.tableId
    return (
      <Fragment>
        {/*<ActionCableConsumer
          channel={{channel: "TablesChannel"}}
          onReceived={(order) => {
            console.log("order was served", order);
            this.props.serveOrderToTable(order);
          }}
        /> */}
      {/*  <ActionCableConsumer
          channel={{channel: "OrderBoardChannel"}}
          onReceived={(order) => {
            console.log('order was recieved', order);
            this.props.postOrderToTable(order);
            // this.props.loadTablesAndOrders();
          }}
        /> */}
        <div className="container">
          <div className="row">
            <h3>Table {this.props.table ? this.props.table.id : null}</h3>
          </div>
          <div className="row">
            <div className="col-3" id="menu">
              <p>Menu</p>
              <ul>
              { this.props.recipes ? this.generateMenu() : null }
              </ul>
            </div>
            <div className="col-9">
              <div className="container">
                <div className="row">
                  <div className="col-12" id="orders-served">
                  Orders Served
                  { this.props.orders ? this.generateServedOrders() : null }
                  </div>
                </div>
                <div className="row">
                  <div className="col-12" id="orders-placed">
                  <p>Orders Placed</p>
                  <ul>
                  { this.props.orders ? this.generatePlacedOrders() : null }
                  </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.usersReducer.user
  }
}

export default connect(mapStateToProps)(Table);

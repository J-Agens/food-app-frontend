import React, { Component, Fragment } from 'react';
import { ActionCableConsumer } from 'react-actioncable-provider';

class Table extends Component {

  generatePlacedOrders = () => {
    const placedOrders = this.props.table.orders.filter(order => order.served === false);
    return placedOrders.map(order => {
      return <li key={order.id}>{order.item_name}</li>
    })
  }

  generateServedOrders = () => {
    const servedOrders = this.props.table.orders.filter(order => order.served === true);
    return servedOrders.map(order => {
      return <li key={order.id}>{order.item_name}</li>
    });
  }

  generateMenu = () => {
    return this.props.recipes.map(rec => {
      return <li className="menu-item" onClick={this.handleClick} key={rec.id}>{rec.name}</li>
    })
  }

  handleClick = (e) => {
    this.props.placeOrder(e.target.textContent);
  }

  render() {
    console.log("TABLE PROPS 'MATCH': ", this.props.match);
    //, table_id: this.props.match.params.tableId
    return (
      <Fragment>
        <ActionCableConsumer
          channel={{channel: "TablesChannel"}}
          onReceived={(order) => {
            console.log("order was served", order);
            this.props.serveOrderToTable(order);
          }}
        />
        <ActionCableConsumer
          channel={{channel: "OrderBoardChannel"}}
          onReceived={(order) => {
            console.log('order was recieved', order);
            this.props.postOrderToTable(order);
          }}
        />
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
                  { this.props.table ? this.generateServedOrders() : null }
                  </div>
                </div>
                <div className="row">
                  <div className="col-12" id="orders-placed">
                  <p>Orders Placed</p>
                  <ul>
                  { this.props.table ? this.generatePlacedOrders() : null }
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

export default Table;

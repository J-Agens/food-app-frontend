import React, { Component, Fragment } from 'react';
import { ActionCableConsumer } from 'react-actioncable-provider';
import Pot from '../components/Pot';
const BASE_URL = "http://localhost:3000/";
const COOK_SESSIONS_URL = BASE_URL + "cook_sessions";
const DEFAULT_STATE = {
  pots: null,
  selectedOrder: null,
  selectedCookSession: null,
  selectedIngredients: [],
  requiredIngredients: []
}

class Kitchen extends Component {

  state = DEFAULT_STATE

  componentDidMount() {
    fetch("http://localhost:3000/pots")
      .then(res => res.json())
      .then(pots => {
        this.setState({ pots })
      })
  }

  handleOrderSelection = (order) => {
    this.setState({ selectedOrder: order })
  }

  generateOrders = () => {
    const placedOrders = this.props.orders.filter(order => {
      return !order.served
    })
    return placedOrders.map(order => {
      return <li onClick={() => this.handleOrderSelection(order)} key={order.id}>{order.item_name} - {order.customer} - Table #{order.table_id}</li>
    })
  }

  createCookSession = (orderInfo, potId) => {
    let formData = {
      order: orderInfo,
      pot_id: potId
    }

    let configObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    }

    fetch(COOK_SESSIONS_URL, configObj)
      .then(res => res.json())
      .then(cookSession => {
        fetch("http://localhost:3000/pots")
          .then(res => res.json())
          .then(pots => {
            this.setState({ pots })
          })
      })
      .catch(error => {
        console.log(error.message);
      })
  }

  deleteCookSession = (sessionId) => {
    fetch(`${COOK_SESSIONS_URL}/${sessionId}`, { method: "DELETE" })
    this.setState(DEFAULT_STATE);
  }

  handleStartCookClick = () => {
    this.createCookSession(this.state.selectedOrder, 1); // hardcoded pot 1
    this.setState({ selectedOrder: null });
  }

  renderPots = () => {
    return this.state.pots.map(pot => {
      return <Pot key={pot.id} pot={pot} selectCookSession={this.selectCookSession} selectedIngredients={this.selectedIngredients} deleteCookSession={this.deleteCookSession}/>
    })
  }

  renderRequiredIngredients = () => {
    return this.state.selectedCookSession["required_ingredients"].map((ing, idx) => {
      return <li key={idx}>{ing}</li>
    });
  }

  selectCookSession = (session) => {
    console.log("selectCookSession(session), session is: ", session)
    this.setState({
      selectedCookSession: session,
      requiredIngredients: session.required_ingredients,
      selectedIngredients: []
    });

  }

  addIngToCookSession = (ing) => {
    if (this.state.requiredIngredients.includes(ing)) {
      this.setState(prevState => {
        return {
          selectedIngredients: [...prevState.selectedIngredients, ing]
        }
      });
    } else {
      alert("Wrong ingredient!")
    }
  }

  checkForSessionCompletion = () => {
    const reqIngs = this.state.requiredIngredients;
    const selIngs = this.state.selectedIngredients;
    const matching = selIngs.filter(ing => reqIngs.includes(ing))
    console.log("reqIngs, selIngs, matching", reqIngs, selIngs, matching);
    if (matching.length === reqIngs.length && selIngs.length > 0) {
      this.props.completeCookSession(this.state.selectedCookSession.id);
      this.setState(DEFAULT_STATE);
      alert("Order Complete");
    }
  }

  render() {
    console.log("KITCHEN: ", this.state);
    if (this.state.selectedCookSession) {
      this.checkForSessionCompletion();
    }
    return (
      <Fragment>
        <ActionCableConsumer
          channel={{channel: "OrderBoardChannel"}}
          onReceived={(order) => {
            console.log('order was recieved', order);
            this.props.postOrderToBoard(order)
          }}
        />
        <div className="container">
          <h4>Kitchen</h4>
          <div className="row">
            <div className="col-2" id="shelf">
              Shelf
              <ul>
                <li>cheese {this.state.selectedCookSession ? <span className="add-ing" onClick={() => this.addIngToCookSession("cheese")}>+</span>: null}</li>
                <li>beef {this.state.selectedCookSession ? <span className="add-ing" onClick={() => this.addIngToCookSession("beef")}>+</span>: null}</li>
                <li>bread {this.state.selectedCookSession ? <span className="add-ing" onClick={() => this.addIngToCookSession("bread")}>+</span>: null}</li>
                <li>butter {this.state.selectedCookSession ? <span className="add-ing" onClick={() => this.addIngToCookSession("butter")}>+</span>: null}</li>
                <li>tomato sauce {this.state.selectedCookSession ? <span className="add-ing" onClick={() => this.addIngToCookSession("tomato sauce")}>+</span>:  null}</li>
                <li>pasta {this.state.selectedCookSession ? <span className="add-ing" onClick={() => this.addIngToCookSession("pasta")}>+</span>: null}</li>
                <li>dough {this.state.selectedCookSession ? <span className="add-ing" onClick={() => this.addIngToCookSession("dough")}>+</span>: null}</li>
                <li>sausage {this.state.selectedCookSession ? <span className="add-ing" onClick={() => this.addIngToCookSession("sausage")}>+</span>: null}</li>
                <li>beans {this.state.selectedCookSession ? <span className="add-ing" onClick={() => this.addIngToCookSession("beans")}>+</span>: null}</li>
                <li>onions {this.state.selectedCookSession ? <span className="add-ing" onClick={() => this.addIngToCookSession("onions")}>+</span>: null}</li>
              </ul>
              <hr />
              Required Ingredients
              {this.state.selectedCookSession ? this.renderRequiredIngredients() : null}
            </div>
            <div className="col-9" id="order-board">
              <p>Order board</p>
              <ul>
                { this.props.orders ? this.generateOrders() : null }
              </ul>
            </div>
          </div>
          <div className="row">
            {this.state.selectedOrder ? <button className="btn btn-secondary" onClick={this.handleStartCookClick}>Start Cook</button> : null }
            <div className="col-12" id="stove">
              stove
              <div className="row justify-content-center">
                {this.state.pots ? this.renderPots() : null}
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default Kitchen;

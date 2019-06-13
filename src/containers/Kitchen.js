import React, { Component, Fragment } from 'react';
import { ActionCableConsumer } from 'react-actioncable-provider';
import Pot from '../components/Pot';
const BASE_URL = "http://localhost:3000/";
const COOK_SESSIONS_URL = BASE_URL + "cook_sessions";
const DEFAULT_STATE = {
  pots: null,
  shelfIngredients: [],
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
    fetch("http://localhost:3000/ingredients")
      .then(res => res.json())
      .then(ings => {
        this.setState({ shelfIngredients: ings })
      })
      .catch(error => {
        console.log(error.message);
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

  onDragStart = (ev, id) => {
    console.log('dragstart:', id);
    ev.dataTransfer.setData("id", id)
  }

  onDragOver = (ev) => {
    console.log("onDragOver running");
    ev.preventDefault();
  }

  onDrop = (ev, potId) => {
    let id = ev.dataTransfer.getData("id");
    console.log("onDrop: ", id);
    if (this.state.selectedCookSession.pot_id === potId) {
      this.addIngToCookSession(id);
    } else {
      alert("wrong pot");
    }
  }

  stockShelf = () => {
    return this.state.shelfIngredients.map((ing, idx) => {
      return (
        <li key={ing.name}
          draggable={this.state.selectedCookSession ? "true" : "false"}
          onDragStart={(e) => this.onDragStart(e, ing.name)}
          id={idx + 100}
        >
            {ing.name}
        </li>
      );
    });
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
        console.log("createCookSession: ", cookSession);
        if (cookSession.error) {
          alert("NO MORE ROOM ON THE STOVE");
        }
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

  deleteCookSession = (sessionId, potId) => {
    fetch(`${COOK_SESSIONS_URL}/${sessionId}`, { method: "DELETE" })
    this.setState(prevState => {
      const newPots = prevState.pots.filter(p => p.id !== potId)
      console.log("New pots: ", newPots);
      return {
        pots: newPots,
        selectedOrder: null,
        selectedCookSession: null,
        selectedIngredients: [],
        requiredIngredients: []
      }
    });
  }

  handleStartCookClick = () => {
    this.createCookSession(this.state.selectedOrder, 1); // hardcoded pot 1
    this.setState({ selectedOrder: null });
  }

  // renderPots = () => {
  //   return this.state.pots.map(pot => {
  //     return (
  //       <Pot
  //         key={pot.id}
  //         pot={pot}
  //         onDragOver={this.onDragOver}
  //         onDrop={this.onDrop}
  //         selectedCookSession={this.state.selectedCookSession}
  //         selectCookSession={this.selectCookSession}
  //         selectedIngredients={this.selectedIngredients}
  //         deleteCookSession={this.deleteCookSession}/>
  //     )
  //   })
  // }

  // TRY TO IMPLEMENT LATER
  renderPots = () => {
    let potsArr = this.state.pots.map(pot => {
      return (
        <Pot
          key={pot.id}
          pot={pot}
          onDragOver={this.onDragOver}
          onDrop={this.onDrop}
          selectedCookSession={this.state.selectedCookSession}
          selectCookSession={this.selectCookSession}
          selectedIngredients={this.selectedIngredients}
          requiredIngredients={this.state.requiredIngredients}
          deleteCookSession={this.deleteCookSession}/>
      )
    });
    const numMissing = (3 - this.state.pots.length);
    let fakes = [];
    for (var i = 0; i < numMissing; i++) {
      fakes.push(<div className="col-2 pot"></div>);
    }
    return potsArr.concat(fakes);
  }

  renderFakePots = () => {
    return [
      <div key="a" className="col-2 pot"></div>,
      <div key="b" className="col-2 pot"></div>,
      <div key="c" className="col-2 pot"></div>
    ]
  }

  renderRequiredIngredients = () => {
    return this.state.selectedCookSession["required_ingredients"].map((ing, idx) => {
      return <li key={idx}>{ing}</li>
    });
  }

  selectCookSession = (session, ings) => {
    console.log("selectCookSession(session), session is: ", session)
    this.setState({
      selectedCookSession: session,
      requiredIngredients: session.required_ingredients,
      selectedIngredients: ings
    });

  }

  addIngToCookSession = (ing) => {
    if (this.state.requiredIngredients.includes(ing) && !this.state.selectedIngredients.includes(ing)) {
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
    if (matching.length === reqIngs.length && selIngs.length === reqIngs.length) {
      this.props.completeCookSession(this.state.selectedCookSession.id);
      this.setState(prevState => {
        const newPots = prevState.pots.filter(p => p.id !== prevState.selectedCookSession.pot_id)
        return {
          pots: newPots,
          selectedOrder: null,
          selectedCookSession: null,
          selectedIngredients: [],
          requiredIngredients: []
        };
      });
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
        <ActionCableConsumer
          channel={{channel: "TablesChannel"}}
          onReceived={(order) => {
            console.log("order was served", order);
            this.props.unpinOrderFromBoard(order);
          }}
        />
        <div className="container">
          <h4>Kitchen</h4>
          <div className="row">
            <div className="col-2" id="shelf">
              Shelf
              <ul>
                { this.stockShelf() }
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
            <div className="col-12" id="stove">
              {this.state.selectedOrder ? <button className="btn btn-secondary" onClick={this.handleStartCookClick}>Start Cook</button> : "stove" }
              <div className="row justify-content-center">
                {this.state.pots ? this.renderPots() : this.renderFakePots()}
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default Kitchen;

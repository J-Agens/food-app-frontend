import React, { Component } from 'react';

class Pot extends Component {

  state = {
    ingredients: [],
    cookSession: null // not being used yet
  }

  handleOnDrop = (e) => {
    let id = e.dataTransfer.getData("id");
    if (!this.state.ingredients.includes(id) && this.props.requiredIngredients.includes(id)) {
      console.log("HANDLE ON DROP CONDITIONAL STATEMENT");
      this.setState(prevState => ({ ingredients: [...prevState.ingredients, id] }))
      this.props.onDrop(e, this.props.pot.id);
    } else {
      alert(`Wrong ingredient! (handleOnDrop)`);
    }
  }

  renderIngs = () => {
    return this.state.ingredients.map(ing => {
      return <span className="tiny">{ing.slice(0, 3)}|</span>
    });
  }

  render() {
    return (
      <div className="pot col-2" style={this.props.selectedCookSession && this.props.selectedCookSession.pot_id === this.props.pot.id ? {backgroundColor: "#526e9b"} : null} onDragOver={(e) => this.props.onDragOver(e)} onDrop={this.handleOnDrop}>

        <h6>
        {this.props.pot.cook_session ? this.props.pot.cook_session.recipe_name : null}
        {this.props.pot.cook_session ? <button onClick={() => this.props.deleteCookSession(this.props.pot.cook_session.id, this.props.pot.id)}>X</button> : null}
        {this.props.pot.cook_session ? <button className="start" onClick={() => this.props.selectCookSession(this.props.pot.cook_session, this.state.ingredients)}>Start</button> : null}
        </h6>
        <p>{ this.props.pot.cook_session ? this.props.pot.cook_session.customer_name : null}</p>
        { this.renderIngs() }
      </div>
    )
  }

}

export default Pot;

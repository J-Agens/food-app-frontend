import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUtensilSpoon, faStopCircle } from '@fortawesome/free-solid-svg-icons'
import ProgressBar from 'react-bootstrap/ProgressBar'

class Pot extends Component {

  state = {
    ingredients: [],
    cookSession: null
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
    return <ProgressBar animated now={(this.state.ingredients.length / 4) * 100}/>
  }

  render() {
    return (
      <div className="pot col-2" style={this.props.selectedCookSession && this.props.selectedCookSession.pot_id === this.props.pot.id ? {backgroundImage: "linear-gradient(#969696, #49E7A5)"} : null} onDragOver={(e) => this.props.onDragOver(e)} onDrop={this.handleOnDrop}>

        <h6>
        { this.props.selectedCookSession && this.props.selectedCookSession.pot_id === this.props.pot.id ? this.renderIngs() :
        <p style={{fontSize: ".75em", paddingTop: "5%"}}>
        {this.props.pot.cook_session ? this.props.pot.cook_session.recipe_name + " - ": null}
        { this.props.pot.cook_session ? this.props.pot.cook_session.customer_name : null}
        </p>
        }
        <div>
          {this.props.pot.cook_session ? <button className="btn cancel-cook watermark pot-watermark"onClick={() => this.props.deleteCookSession(this.props.pot.cook_session.id, this.props.pot.id)}><FontAwesomeIcon icon={faStopCircle} size="2x"/></button> : null}
          {this.props.pot.cook_session ? <button className="btn select-cook watermark pot-watermark" onClick={() => this.props.selectCookSession(this.props.pot.cook_session, this.state.ingredients)}><FontAwesomeIcon icon={faUtensilSpoon} size="2x"/></button> : null}
        </div>
        </h6>
      </div>
    )
  }

}

export default Pot;

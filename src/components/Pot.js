import React, { Component } from 'react';

class Pot extends Component {

  render() {
    return (
      <div className="pot col-2" onDragOver={(e) => this.props.onDragOver(e)} onDrop={(e) => this.props.onDrop(e)}>

        <h6>
        {this.props.pot.cook_session ? this.props.pot.cook_session.recipe_name : null}
        {this.props.pot.cook_session ? <button onClick={() => this.props.deleteCookSession(this.props.pot.cook_session.id)}>X</button> : null}
        {this.props.pot.cook_session ? <button className="start" onClick={() => this.props.selectCookSession(this.props.pot.cook_session)}>Start</button> : null}
        </h6>
        <p>{ this.props.pot.cook_session ? this.props.pot.cook_session.customer_name : null}</p>
      </div>
    )
  }

}

export default Pot;

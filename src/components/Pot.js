import React from 'react';

const Pot = (props) => {
  // console.log("POT cookSession: ", props.pot.cook_session.recipe_name);
  return (
    <div className="pot col-2" onClick={() => props.selectCookSession(props.pot.cook_session)}>
      <h6>{props.pot.cook_session ? props.pot.cook_session.recipe_name : null} {props.pot.cook_session ? <button onClick={() => props.deleteCookSession(props.pot.cook_session.id)}>X</button> : null}</h6>
      <p>{ props.pot.cook_session ? props.pot.cook_session.customer_name : null}</p>
    </div>
  )
}

export default Pot;

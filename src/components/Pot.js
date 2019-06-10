import React from 'react';

const Pot = (props) => {
  // console.log("POT cookSession: ", props.pot.cook_session.recipe_name);
  return (
    <div className="pot col-2">

      <h6>
      {props.pot.cook_session ? props.pot.cook_session.recipe_name : null}
      {props.pot.cook_session ? <button onClick={() => props.deleteCookSession(props.pot.cook_session.id)}>X</button> : null}
      {props.pot.cook_session ? <button className="start" onClick={() => props.selectCookSession(props.pot.cook_session)}>Start</button> : null}
      </h6>
      <p>{ props.pot.cook_session ? props.pot.cook_session.customer_name : null}</p>
    </div>
  )
}

export default Pot;

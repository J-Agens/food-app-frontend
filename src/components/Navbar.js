import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { LOGOUT } from '../actions/types';

class NavBar extends Component {

  logOut = () => {
    localStorage.clear();
    this.props.dispatch({
      type: LOGOUT
    });
  }

  render() {
    // console.log("NAVBAR PROPS: ", this.props);
    return (
      <div className="navbar">
        <NavLink to="/">Home</NavLink>
        {/* <NavLink to="/tables">Table</NavLink> */}
        <NavLink to="/tables">Tables</NavLink>
        <NavLink to="/kitchen">Kitchen</NavLink>
        <button onClick={this.logOut}>Log Out</button>
      </div>
    );
  }

};

export default connect()(NavBar);

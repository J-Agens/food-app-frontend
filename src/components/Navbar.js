import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../actions/userActions';

class NavBar extends Component {

  logOut = () => {
    localStorage.clear();
  }

  render() {
    console.log("NAVBAR PROPS: ", this.props);
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

export default connect(null, { logout })(NavBar);

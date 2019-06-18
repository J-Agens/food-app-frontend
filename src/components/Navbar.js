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
      <nav className="navbar navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
        <a class="navbar-brand" href="#">Untitled Project</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li class="nav-item active">
              <NavLink to="/" className="nav-link">Home</NavLink>
            </li>
            <li class="nav-item">
              <NavLink to="/tables" className="nav-link">Tables</NavLink>
            </li>
            <li class="nav-item">
              <NavLink to="/kitchen" className="nav-link">Kitchen</NavLink>
            </li>
            <li class="nav-item">
              <button onClick={this.logOut} className="nav-link">Log Out</button>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Dropdown link
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
                <a class="dropdown-item" href="#">Something else here</a>
              </div>
            </li>
          </ul>
        </div>
        <form class="form-inline my-2 my-lg-0">
          <button class="btn btn-outline-success my-2 my-sm-0" onClick={this.logOut}>Log Out</button>
        </form>

        {/* <NavLink to="/tables">Table</NavLink> */}


        </div>
      </nav>
    );
  }

};

export default connect()(NavBar);

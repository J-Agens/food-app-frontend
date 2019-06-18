import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { LOGOUT } from '../actions/types';
import { Navbar, Nav, Button, FormControl, NavDropdown, Form, Container } from 'react-bootstrap';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCoffee } from '@fortawesome/free-solid-svg-icons'

class NavComponent extends Component {

  logOut = () => {
    localStorage.clear();
    this.props.dispatch({
      type: LOGOUT
    });
  }

  render() {
    // console.log("NAVBAR PROPS: ", this.props);
    return (
      <React.Fragment>
      {/*
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
        </div>
      </nav> */}
        <Navbar bg="light" varient="light" expand="lg">
          <Container>
            <Navbar.Brand>{this.props.user.username}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <NavDropdown title="Tables" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/tables/1">Table 1</NavDropdown.Item>
                  <NavDropdown.Item href="/tables/2">Table 2</NavDropdown.Item>
                  <NavDropdown.Item href="/tables/3">Table 3</NavDropdown.Item>
                  <NavDropdown.Item href="/tables/4">Table 4</NavDropdown.Item>
                  <NavDropdown.Item href="/tables/5">Table 5</NavDropdown.Item>
                  <NavDropdown.Item href="/tables/6">Table 6</NavDropdown.Item>
                  <NavDropdown.Item href="/tables/7">Table 7</NavDropdown.Item>
                  <NavDropdown.Item href="/tables/8">Table 8</NavDropdown.Item>
                  <NavDropdown.Item href="/tables/9">Table 9</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/tables">All</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/kitchen">Kitchen</Nav.Link>
              </Nav>
              <form class="form-inline my-2 my-lg-0">
                <button class="btn btn-outline-info my-2 my-sm-0" onClick={this.logOut}>Log Out</button>
              </form>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </React.Fragment>
    );
  }

};

const mapStateToProps = state => {
  return {
    user: state.usersReducer.user
  }
}

export default connect(mapStateToProps)(NavComponent);

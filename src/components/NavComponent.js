import React, { Component } from 'react';
// import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { LOGOUT } from '../actions/types';
import { Navbar, Nav, Button, FormControl, NavDropdown, Form, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

class NavComponent extends Component {

  logOut = () => {
    localStorage.clear();
    this.props.dispatch({
      type: LOGOUT
    });
  }

  render() {
    return (
      <React.Fragment>
        <Navbar expand="lg">
          <Container>
            <Navbar.Brand>{this.props.user.username}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" style={{backgroundColor: '#90C4AF'}}/>
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
              <form className="form-inline my-2 my-lg-0">
                <button className="btn btn-outline-info my-2 my-sm-0" onClick={this.logOut}>Log Out</button>
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

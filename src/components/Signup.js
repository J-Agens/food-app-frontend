import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { signup } from '../actions/userActions';
// import { login } from '../actions/userActions';
class Signup extends Component {
  state = {
    username: "",
    password: ""
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let formData = this.state;
    let configObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    };

    fetch("http://localhost:3000/signup", configObj)
      .then(res => res.json())
      .then(user => {
        this.props.signup(user);
        this.props.loadTablesAndOrders();
      })

    this.setState({ username: "", password: "" })
  }

  render() {
    console.log("SIGNUP PROPS: ", this.props.dispatch);
    return (
      <div className="home-form">
        <h3>Sign Up</h3>
        <form className="form-inline" onSubmit={this.handleSubmit}>
          <input className="form-control" type="text" name="username" value={this.state.username} onChange={this.handleChange} placeholder="username"/>
          <input className="form-control" type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="password"/>
          <input className="btn btn-secondary" type="submit" value="Sign Up"/>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    login: (user) => dispatch({ type: "LOGIN", payload: user }),
    signup: (user) => dispatch({ type: "SIGNUP", payload: user })
  }
}

export default connect(null, mapDispatchToProps)(Signup);

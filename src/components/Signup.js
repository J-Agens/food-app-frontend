import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signup } from '../actions/userActions';

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
        this.props.signup(user)
      })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" name="username" value={this.state.username} onChange={this.handleChange} placeholder="username"/>
        <input type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="password"/>
        <input type="submit" value="Sign Up"/>
      </form>
    );
  }
}

export default connect(null, { signup })(Signup);

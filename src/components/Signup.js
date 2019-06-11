import React, { Component } from 'react';

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
    console.log("form submitted");
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

export default Signup;

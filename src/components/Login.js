import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LOGIN } from '../actions/types';
import { login } from '../actions/userActions';

class Login extends Component {
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
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        user: this.state
      })
    })
      .then(res => res.json())
      .then(data => {
        const { token, user } = data;
        localStorage.setItem('token', token);
        console.log("LOGIN => user: ", user);
        this.props.login(user)
        // this.props.dispatch({
        //   type: LOGIN,
        //   payload: user
        // });
      })
    this.setState({ username: "", password: "" })
  }

  render() {
    return (
      <div className="home-form">
        <h3>Login</h3>
        <form onSubmit={this.handleSubmit} className="form-inline">
          <input className="form-control" type="text" name="username" value={this.state.username} onChange={this.handleChange} placeholder="username"/>
          <input className="form-control" type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="password"/>
          <input className="btn btn-secondary" type="submit" value="Login"/>
        </form>
      </div>
    );
  }
}

export default connect(null, { login })(Login);

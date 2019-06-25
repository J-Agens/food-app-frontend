import React, { Component } from 'react';
import { connect } from 'react-redux';
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
    fetch('https://cryptic-scrubland-43079.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        user: this.state
      })
    })
      // .then(res => res.json())
      .then(data => {
        if (!!data.user) {
          const { token, user } = data;
          localStorage.setItem('token', token);
          console.log("LOGIN => user: ", user);
          this.props.login(user)
        } else {
          console.log("DATA (likely errors): ", data);
        }

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
        <form onSubmit={this.handleSubmit} className="form-group">
          <input className="form-control my-input" type="text" name="username" value={this.state.username} onChange={this.handleChange} placeholder="username"/>
          <input className="form-control my-input" type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="password"/>
          <input className="btn btn-secondary my-btn" type="submit" value="Login"/>
        </form>
      </div>
    );
  }
}

export default connect(null, { login })(Login);

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
    if (this.state.username && this.state.password) {

      let formData = this.state;
      let configObj = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      };

      fetch("https://cryptic-scrubland-43079.herokuapp.com/signup", configObj)
        .then(res => res.json())
        .then(user => {
          this.props.signup(user);
          // this.props.loadTablesAndOrders();
        })
        // have to log the new user in
        .then(() => {
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
              this.setState({ username: "", password: "" })
            })
        })

    }
  }

  render() {
    console.log("SIGNUP PROPS: ", this.props.dispatch);
    return (
      <div className="home-form">
        <h3>Sign Up</h3>
        <form className="form-group" onSubmit={this.handleSubmit}>
          <input className="form-control my-input" type="text" name="username" value={this.state.username} onChange={this.handleChange} placeholder="username"/>
          <input className="form-control my-input" type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="password"/>
          <input className="btn btn-secondary my-btn" type="submit" value="Sign Up"/>
        </form>
        <p className="watermark title-watermark">Restaurant Simulator</p>
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

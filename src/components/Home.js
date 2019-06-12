import React, { Component } from 'react';
import Login from './Login';
import Signup from './Signup';

class Home extends Component {

  render() {
    return (
      <div className="row">
        <div className="col-6"><Login /></div>
        <div className="col-6"><Signup /></div>
      </div>
    )
  }
}

export default Home;

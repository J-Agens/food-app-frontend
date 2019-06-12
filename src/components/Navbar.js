import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {

  const logOut = () => {
    localStorage.clear();
    // use dispatch to logout
  }
  return (
    <div className="navbar">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/tables">Table</NavLink>
      <NavLink to="/tables">Tables List</NavLink>
      <NavLink to="/kitchen">Kitchen</NavLink>
      <button onClick={logOut}>Log Out</button>
    </div>
  );
};

export default NavBar;

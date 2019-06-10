import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  return (
    <div className="navbar">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/table">Table</NavLink>
      <NavLink to="/main">Main</NavLink>
      <NavLink to="/kitchen">Kitchen</NavLink>
    </div>
  );
};

export default NavBar;

import React from 'react';
import './header.styles.css';
import logo from '../../assets/logo.png';

const Header = () => (
  <div className="header">
    <img src={logo} className="logo" alt="logo" />
    <div className="title">
      Chess Studies
    </div>
  </div>
)
export default Header;
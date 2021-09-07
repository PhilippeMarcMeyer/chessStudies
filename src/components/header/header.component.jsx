import React from 'react';
import './header.styles.css';
import logo from '../../assets/logopmg.png';

const Header = () => {
  return (
  <div className="header">
    <img src={logo} className="logo" alt="logo" />
    <div className="title">
      Chess Studies
    </div>
  </div>
  )
}
export default Header;
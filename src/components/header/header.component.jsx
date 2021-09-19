import React from 'react';
import './header.styles.css';
import logo from '../../assets/zadigChess.png';

const Header = (props) => {
  return (
  <div className="header">
    <img src={"./"+logo} className="logo" alt="logo" />
    <div className="title">
      Chess Studies <span className="storageType">{props.parentInfos.storageType}</span>
    </div>
  </div>
  )
}
export default Header;
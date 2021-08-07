import React from 'react';
import './info.styles.css';

const Info = (props) => {
  return(
  <div className='board-zone'>
   <h3 className='board-title'>{props.game.infos}</h3>
   </div>
  )
   }
  export default Info;
import React from 'react';
import './board.styles.css';

const Board = (props) => {
  return(
  <div className='board-zone'>
   <h3 className='board-title'>{props.game.infos}</h3>
   <div className='board'>
   {
    props.game.data
      .map((x,i) => (
        <div className={`square ${x.squareColor} ${(i+1) % props.game.nrSquaresPerside === 0} ? "square-right" : ""}`}/>
      ))
    }
   </div>
   </div>
  )
   }
  export default Board;


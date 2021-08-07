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
        <React.Fragment>
        <br className={(i) % props.game.nrSquaresPerside === 0 ? '' : 'hidden'}/>
  
        <div className={ 'square '+x.squareColor}>{i}</div>
        </React.Fragment>
      ))
    }
   </div>
   </div>
  )
   }
  export default Board;


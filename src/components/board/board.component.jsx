import React from 'react';
import './board.styles.css';

const Board = (props) => {
  return(
  <div className='board-zone'>
   <div className='board'>
   {
    props.game.data
      .map((x,i) => (
        <React.Fragment>
        <br className={(i) % props.game.nrSquaresPerside === 0 && i > 0 ? 'cr' : 'hidden'}/>
  
        <div key={i} data-pos={i} className={ 'square '+x.squareColor} dangerouslySetInnerHTML={{__html: props.game.figCodes[x.fig] ?props.game.figCodes[x.fig]:'&nbsp;' }} />
        </React.Fragment>
      ))
    }
   </div>
   </div>
  )
   }
  export default Board;


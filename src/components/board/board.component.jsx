import React from 'react';
import './board.styles.css';

const Board = (key,data,nrSquaresPerside,infos) => (
  <div className='board-zone'>
   <h1 className='title'>{infos.toUpperCase()}</h1>
   <div className='board'>
   {data
      .map((x,i) => (
        <Square className="square {x.squareColor} {i+1 % nrSquaresPerside == 0 ? 'square-right' : ''}/>"
      ))
    }
   </div>
   </div>
      
 )
  export default Board;


import React from 'react';
import './board.styles.css';
import Prisoners from '../prisoners/prisoners.component';
const Board = (props) => {
  return (
    <div className={`board-zone ${props.game.doReverseBoard ? "inverse" : ""}`} >
      <Prisoners side="w" reverseBoard={props.reverseBoard} figCodes={props.game.figCodes} pgnResume={props.game.pgnResume} scores={props.game.scores}/>
      <div className='board'>
        {
          props.game.data
            .map((x, i) => (
              <React.Fragment key={i}>
                <div key={i} data-pos={i} className={'square ' + x.squareColor} dangerouslySetInnerHTML={{ __html: props.game.figCodes[x.fig] ? props.game.figCodes[x.fig] : '&nbsp;' }} />
              </React.Fragment>
            ))
        }
      </div>
      <Prisoners side="b" reverseBoard={props.reverseBoard} figCodes={props.game.figCodes} pgnResume={props.game.pgnResume} scores={props.game.scores}/>
    </div>
  )
   }
  export default Board;


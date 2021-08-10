import React from 'react';
import './info.styles.css';

const Info = (props) => {
  let isPGNon = props.game.pgnOn;
  let pgn = props.game.pgnHistory
  if (isPGNon) {
    return(
    <div className='board-zone'>
    <h3 className='board-title'>{props.game.infos}</h3>
    PGNInfos....
    </div>
    )
  } else {
    return(
    <div className='board-zone'>
    <h3 className='board-title'>{props.game.infos}</h3>
    <textarea id="game-input" className="game-input" name="pgn">{pgn}</textarea>
    <button onClick={props.savePGN}>Go</button>
    </div>
    )
  }
   }
  export default Info;
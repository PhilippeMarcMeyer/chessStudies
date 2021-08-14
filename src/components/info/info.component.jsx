import React from 'react';
import './info.styles.css';
import Turns from '../turns/turns.component';

const Info = (props) => {
  let status = props.game.status;
  let pgn = props.game.pgnHistory

  if(status === props.statuses.off){
      return(
        <div className='info-zone'>
          <h3 className='board-title'>{props.game.infosTitle}</h3>
          <textarea id="game-input" className="game-input" name="pgn">{pgn}</textarea>
          <button onClick={props.savePGN}>Go</button>
        </div>
      )
  }
  else if (status === props.statuses.loaded) {
      return(
        <div className='info-zone'>
          <h3 className='board-title'>{props.game.infosTitle}</h3>
          <p className='infosMessage'>{props.game.infosMessage}</p>

        </div>
      )
    } else if (status === props.statuses.ready) {
      return(
        <div className='turns-zone'>
          <h3 className='board-title'>{props.game.infosTitle}</h3>
          <p className='infosMessage'>{props.game.pgnResume.Date} {props.game.pgnResume.Date} vs {props.game.pgnResume.Black} {props.game.pgnResume.Result}</p>
          <Turns turnsList = {props.game.pgnGame} />
        </div>
      )
    } else{
      return(
        <div className='info-zone'>
          <h3 className='board-title'>404</h3>
          <p className='infosMessage'>Sorry Buddy, I'm afraid we are lost !</p>
        </div>
      ) 
    }
  }

  export default Info;
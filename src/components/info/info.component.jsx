import React from 'react';
import './info.styles.css';
import Turns from '../turns/turns.component';
import Resume from '../resume/resume.component';
import MovesCommands from '../movesCommands/movesCommands.component';

const Info = (props) => {
  let status = props.game.status;
  let pgn = props.game.pgnHistory;
  let statuses = props.statuses;
  /*
    "init":0,
    "showList":1,
    "showInput":2,
    "showMoves":3,
    "showMessage":4,
    "inError":-1,
	// other
"proposeSave":false,
  */
  if(status === statuses.showInput){
      return(
        <div className='info-zone'>
          <h3 className='board-title'>{props.game.infosTitle}</h3>
          <textarea id="game-input" className="game-input" name="pgn" defaultValue={pgn}></textarea>
          <button onClick={props.savePGN}>Go</button>
        </div>
      )
  }
  else if (status === statuses.showList) { // todo : showList
    return(
      <div className='info-zone'>
        <h3 className='board-title'>{props.game.infosTitle}</h3>
        <p className='infosMessage'>{props.game.infosMessage}</p>
      </div>
    )
  }
  else if (status === statuses.showMessage || status === statuses.inError|| status === statuses.init) { 
    return(
      <div className='info-zone'>
        <h3 className='board-title'>{props.game.infosTitle}</h3>
        <p className='infosMessage'>{props.game.infosMessage}</p>
      </div>
    )
  }
 else if (status === statuses.showMoves) { // add proposeSave : tue|false (button to save loaded game to locaStorage or back in the future (or both))
      return(
        <div className='turns-zone'>
          <Resume resume = {props.game.pgnResume}/>
          <Turns turnsList = {props.game.pgnGame} currentMove={props.game.move} movePGN = {props.movePGN}/>
          <MovesCommands movePGN = {props.movePGN}/> 
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
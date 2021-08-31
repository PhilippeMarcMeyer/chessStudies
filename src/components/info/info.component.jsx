import React from 'react';
import './info.styles.css';
import Turns from '../turns/turns.component';
import Resume from '../resume/resume.component';
import MovesCommands from '../movesCommands/movesCommands.component';

const Info = (props) => {
  let status = props.game.status;
  let pgn = props.game.pgnHistory;
let statuses = props.statuses;
  console.log(statuses);
  /*
  "initializing":0,
  "chooseFromList":1,
  "addingPGN":2,
  "analysingPGN":3,
  "gameReady":4,
  "inerror":5*/
  if(status === statuses.addingPGN){
      return(
        <div className='info-zone'>
          <h3 className='board-title'>{props.game.infosTitle}</h3>
          <textarea id="game-input" className="game-input" name="pgn" defaultValue={pgn}></textarea>
          <button onClick={props.savePGN}>Go</button>
        </div>
      )
  }
  else if (status === statuses.initializing) { 
    return(
      <div className='info-zone'>
        <h3 className='board-title'>{props.game.infosTitle}</h3>
        <p className='infosMessage'>{props.game.infosMessage}</p>
      </div>
    )
  }
  else if (status === statuses.analysingPGN) { 
    return(
      <div className='info-zone'>
        <h3 className='board-title'>{props.game.infosTitle}</h3>
        <p className='infosMessage'>{props.game.infosMessage}</p>
      </div>
    )
  }
  else if (status === statuses.chooseFromList) { // List
      return(
        <div className='info-zone'>
          <h3 className='board-title'>{props.game.infosTitle}</h3>
          <p className='infosMessage'>{props.game.infosMessage}</p>

        </div>
      )
    } else if (status === statuses.gameReady) {
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
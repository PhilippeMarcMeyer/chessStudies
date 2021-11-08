import React from 'react';
import './info.styles.css';
import Turns from '../turns/turns.component';
import Resume from '../resume/resume.component';
import MovesCommands from '../movesCommands/movesCommands.component';
import GameList from '../gameList/gameList.component';
import GameMenu from '../gameMenu/gameMenu.component';
import GameListSearch from '../gameListSearch/gameListSearch.component';
import OpeningList from '../OpeningList/openingList.component';

const Info = (props) => {
  let status = props.game.status;
  let statuses = props.statuses;
  if(status === statuses.showInput){
      return(
        <React.Fragment>
        <GameMenu menuMove = {props.menuMove} movesLoaded={props.game.pgnHistory && props.game.pgnHistory > 1}/>
        <div className='info-zone'>
          <h3 className='board-title'>{props.game.infosTitle}</h3>
          <textarea id="game-input" className="game-input" name="pgn"></textarea>
          <button onClick={props.savePGN}>Go</button>
        </div>
        </React.Fragment>
      )
  }
  else if (status === statuses.showList) { // todo : showList
    return(
      <React.Fragment>
      <GameMenu menuMove = {props.menuMove} movesLoaded={props.game.pgnHistory && props.game.pgnHistory.length > 1 ? true:false}/>
      <div className='list-zone'>
        <GameListSearch toggleShowLines={props.toggleShowLines} showLines={props.game.showLines} onChangePlayer={props.onChangePlayer} knownPlayers={props.knownPlayers} onChangeOpening={props.onChangeOpening} knownOpenings={props.knownOpenings}/>
        <GameList games={props.game.games} deleteGame={props.deleteGame} loadGame={props.loadGame} knownPlayers={props.knownPlayers} knownOpenings={props.game.knownOpenings} showLines={props.game.showLines} online={props.game.isRemote}/>
        <OpeningList lines={props.lines} showLines={props.game.showLines} loadLine={props.loadLine} />
      </div>
      </React.Fragment>
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
 else if (status === statuses.showMoves || status === statuses.showOpening) { // add proposeSave : tue|false (button to save loaded game to locaStorage or back in the future (or both))
      return(
        <React.Fragment>
        <GameMenu menuMove = {props.menuMove} movesLoaded={props.game.pgnHistory && props.game.pgnHistory > 1}/>
        <div className='turns-zone'>
          <Resume resume = {props.game.pgnResume}/>
          <Turns turnsList = {props.game.pgnGame} width={props.game.windowWidth} currentMove={props.game.move} movePGN = {props.movePGN}/>
          <MovesCommands movePGN = {props.movePGN}/> 
        </div>
        </React.Fragment>
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
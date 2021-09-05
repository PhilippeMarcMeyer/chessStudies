import React from 'react';
import './gameList.styles.css';
const GameList = (props) => {
    return (
        <div className="game-list">
            <ol>
                { 
                    props.games.map((game, index) =>
                        <li key={index}>
                          {game.pgnResume.Event} {game.pgnResume.Site} {game.pgnResume.Date} <br/>
                          {game.pgnResume.White} ({game.pgnResume.WhiteElo}) {"vs"} {game.pgnResume.Black} ({game.pgnResume.BlackElo})  {"=>"} {game.pgnResume.Result}
                          <span className="button delete" data-index={index} onClick={props.deleteGame}>Delete</span>
                          <span className="button" data-index={index} onClick={props.loadGame}>Load</span>
                        </li>
                    )
                }
            </ol>
        </div>
    )
}

export default GameList;
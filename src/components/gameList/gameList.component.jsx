import React from 'react';
import './gameList.styles.css';
const GameList = (props) => {
    return (
        <div className="game-list">
            <ol>
                { 
                    props.games.map((game, index) =>
                        <li key={index}>
                            <div className="list-element" >
                                <span className="list-element-text" >
                                {game.pgnResume.Event} {game.pgnResume.Site} {game.pgnResume.Date} <br/>
                                {game.pgnResume.White} ({game.pgnResume.WhiteElo}) {"vs"} {game.pgnResume.Black} ({game.pgnResume.BlackElo})  {"=>"} {game.pgnResume.Result}
                                </span>
                                <span className="button choose" data-index={index} onClick={props.loadGame}></span>
                                <span className="button delete" data-index={index} onClick={props.deleteGame}></span>
                            </div>
                        </li>
                    )
                }
            </ol>
        </div>
    )
}

export default GameList;
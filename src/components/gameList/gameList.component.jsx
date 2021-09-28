import React from 'react';
import './gameList.styles.css';
const GameList = (props) => {
    let selectedOpening = props.knownOpenings && props.knownOpenings.selected ?props.knownOpenings.selected : "all";
    let games = props.games;
    if(selectedOpening !== "all"){
        games = games.filter((x) => {
            return "opening" in x.pgnResume && x.pgnResume.opening === selectedOpening;
        })
    }
    return (
        <div className="game-list">
            <ol>
                { 
                    games.map((game, index) =>
                        <li key={index}>
                            <div className="list-element" >
                                <span className="list-element-text" >
                                {game.pgnResume.Event} {game.pgnResume.Site} {game.pgnResume.Date} <br/>
                                {game.pgnResume.White} {"vs"} {game.pgnResume.Black} {"=>"} {game.pgnResume.Result} <br/>
                                {"White elo : "}{game.pgnResume.WhiteElo} {"Black elo : "} {game.pgnResume.BlackElo} <br/>
                                {"Opening : "} {game.pgnResume.opening} {" "} {game.pgnResume.openingMoves} <br/>
                                </span>
                                <span className="button choose" data-index={game.id} onClick={props.loadGame}></span>
                                <span className={`button delete ${!props.online  ? "hidden" : ""}`} data-index={game.id} onClick={props.deleteGame}></span>
                            </div>
                        </li>
                    )
                }
            </ol>
        </div>
    )
}

export default GameList;
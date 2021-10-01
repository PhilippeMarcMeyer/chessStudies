import React from 'react';
import './analysis.styles.css';

const Analysis = (props) => {
    return (
        <div className='analysis-zone'>
            <h3 className='analysis-title'>{props.analysis ? props.analysis.title:""}</h3>
            <p className='analysis-text'>{props.analysis ? props.analysis.text:""}</p>
            <div className='analysis-moves'>{props.analysis ? props.analysis.moves:""}</div>
            <div className={`button saveOpening ${!props.analysis ? "hidden" : ""}`} onClick={props.saveOpening}></div>
            <div className={`${"games" in props.identicalGames && props.identicalGames.games.length > 0 ? "analysis-games" : "hidden"}`}>
                <h3 className='analysis-games-title'>Similar games : </h3>
                
                {
                    "games" in props.identicalGames && props.identicalGames.games.length > 0 ?
                    <ol>
                        <li data-index={props.identicalGames.originalKey} data-number={props.identicalGames.move.number} data-side={props.identicalGames.move.side} onClick={props.loadGame}>
                            Current game
                        </li>
                    </ol>
                    :""
                }

                <ul>
                    {
                        "games" in props.identicalGames && props.identicalGames.games.map((idem, index) =>
                            <li key={index} data-index={idem.key} data-number={idem.move.number} data-side={idem.move.side} onClick={props.loadGame}>
                                {idem.digest}
                            </li>
                        )
                    }
                </ul>
            </div>
        </div>
    )
}

export default Analysis;
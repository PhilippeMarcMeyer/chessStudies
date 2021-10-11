import React from 'react';
import './analysis.styles.css';
import Comment from '../utils/comment.component';

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
          <h3>Comments on the game :</h3>
            <Comment commentIsOpen={props.commentIsOpen} comments={props.comments} openComments={props.openComments} saveComment = {props.saveComment}/>
        </div>
    )
}

export default Analysis;
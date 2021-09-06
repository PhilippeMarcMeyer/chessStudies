import React from 'react';
import './prisoners.styles.css';

function createReverseSign() {
return {__html: '&UpArrowDownArrow;'};
}

function prepareScore(score){
    if(score === 0) return "";
    return score > 0 ? "+"+score : ""+score;
}

function prepareJail(listW,listB,figCodes,side){
    let color = side === "w" ? "B" : "W";
    let result = "";
    let list = side === "w" ? listB : listW;
    let previous = list && list.length > 1 ? list[0] : "";
    list.forEach((x) => {
        if(previous !== x){
            result+="&nbsp;&nbsp;";
            previous = x;
        }
        result += figCodes[x+color];
    });
    return {__html: result};
}


const Prisoners = (props) => {
    let whiteJail = props.scores.whiteJail;
    let blackJail = props.scores.blackJail;
    let figCodes = props.figCodes;
    let side = props.side;
    return (
        <div className={`jail ${props.boardPosition === "inversed" ? "reverse" : ""} 
        ${props.side === "b" ? (props.boardPosition === "inversed" ? "black" : "white") : (props.boardPosition === "inversed" ? "white" : "black")}`}>
            <span className="jail-yard">
                <span className="score">{props.side === "b" ? prepareScore(props.scores.whiteScore) : prepareScore(props.scores.blackScore)}</span>
                <span className="list" dangerouslySetInnerHTML={prepareJail(whiteJail,blackJail,figCodes,side)}/>
                 
            </span>
            <span className="inverse-clickable" onClick={props.reverseBoard} dangerouslySetInnerHTML={createReverseSign()}/>
        </div>
    )
}
export default Prisoners;


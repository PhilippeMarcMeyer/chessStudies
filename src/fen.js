//4r3/N1kbQ3/2r2p2/4p1p1/8/7P/PP4P1/2q2NK1 w - - 5 32
import {charIsLowercase} from './utils.js';

const boardToFen = (gamePositions,nextMoveData,columnsOrdered) => {
let fen = "";
let separator = "";
let index = 0;
let nullCounter = 0;
let currentFigure = "";
[1,2,3,4,5,6,7,8].forEach((row) => {
    fen+=separator;
    separator = "/";
    nullCounter = 0;
    columnsOrdered.forEach((x,col) => {
        index = (row-1) * 8 + col;
        currentFigure = gamePositions[index].fig;
        if(currentFigure === null){
            nullCounter++;
        }else{
            if(nullCounter > 0){
                fen+=nullCounter+"";
                nullCounter = 0;
            }
            if(currentFigure.charAt(1) === "B"){
                fen+=currentFigure.charAt(0).toLowerCase();
            }else{
                fen+=currentFigure.charAt(0).toUpperCase();
            }
        }
    })
    if(nullCounter > 0){
        fen+=nullCounter+"";
        nullCounter = 0;
    }
})
console.log(nextMoveData)
// posible castles are missing and number of moves since the last pawn move or check (?)
fen += " " + nextMoveData.moveSide + " - - 0 " + nextMoveData.number ;
    return fen;
}

const fenToBoard = (fen,board,columnsOrdered) => {
    if(!fen) return null;
    let parts = fen.split(" ");
    let colDatas = parts[0].split("/");
    if(colDatas.length !== 8) return null;
    let cursorPos = -1
    colDatas.forEach((colData,i) => {
        cursorPos = i*8;
        let colDataLen = colData.length;
        for(let c = 0;c < colDataLen;c++ ){
            let char = colData.charAt(c);
            let intTry = parseInt(char);
            if (!isNaN(intTry)) {
                for (let d = 0; d < intTry; d++) {
                    board[cursorPos + d].fig = null;
                }
                cursorPos+=intTry;
            }else{
                let side = "W";
                let fig = char;
                if(charIsLowercase(char)){ // Black
                    side = "B";
                    if (char === "p") {
                        fig = "p";
                    } else {
                        fig = char.toUpperCase();
                    }
                }else{ // White
                    if (char === "P") {
                        fig = "p";
                    } else {
                        fig = char;
                    }
                } 
                board[cursorPos].fig = fig + side;
                cursorPos++;
            }
        }
    });

    return board;
}

export {boardToFen,fenToBoard};
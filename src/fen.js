//4r3/N1kbQ3/2r2p2/4p1p1/8/7P/PP4P1/2q2NK1 w - - 5 32

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
                fen+=currentFigure.charAt(0).toUpperCase();
            }else{
                fen+=currentFigure.charAt(0).toLowerCase();
            }
        }
    })
    if(nullCounter > 0){
        fen+=nullCounter+"";
        nullCounter = 0;
    }
})
return fen;
}

const fenToBoard = (fen) => {
let board = [];
    
return board;
}

export {boardToFen,fenToBoard};
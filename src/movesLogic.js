const getMoveOffset = (move) => {
    return move.number === 0 ? 0 : ((move.number-1)*2) + (move.side === "w" ? 1 : 2);
}

const getAskedMove = (elem) => {
    let turn = 0;
    let side = "w";
    let askedMove = null;
    if(elem.hasAttribute("data-turn") && elem.hasAttribute("data-side")){
      turn = parseInt(elem.getAttribute("data-turn"));
      if(isNaN(turn)){
        turn = 0;
      }
      side = elem.getAttribute("data-side")
    }
    if(turn>0){
      askedMove={"number":turn,"side":side};
    }
    return askedMove;
  }

  const getNextMove = (gamePositions,currentMove,askedMove) => {
    let askedMoveOffset = getMoveOffset(askedMove);
    let currentMoveOffset = getMoveOffset(currentMove);

    let nextMoveData = {
      moveSide:"",
      moveColumn : 0,
      moveRow : "",
      movePieceType : null,
      moveType : null, // move, move2Squares, castle, take
      isCheck : false, // maybe not usefull
      moveMaybe : null, // for instance 1 or 2 squares for the pawn
      isError : false
    };

    if(askedMoveOffset > currentMoveOffset){
      let nextMoveOffset = currentMoveOffset === 0 ? currentMoveOffset = 1 : currentMoveOffset+1;
      let nextMovePosition = {}
      if(nextMoveOffset % 2 === 1){
        nextMovePosition.number = Math.trunc(currentMoveOffset/2)+1;
        nextMovePosition.side = "w";
      }else{
        nextMovePosition.number = currentMoveOffset/2;
        nextMovePosition.side = "b";
      }
      
      let nextMove = gamePositions[nextMovePosition.number-1][nextMovePosition.side];

      nextMoveData.moveSide = nextMovePosition.side;

      if(nextMove.length === 2 || (nextMove.length === 3 && nextMove.charAt(2) === "+")){// pawn move
        nextMoveData.isCheck = nextMove.length === 3;
        nextMoveData.movePieceType = "p";
        nextMoveData.moveColumn = nextMove.charAt(0);
        nextMoveData.moveRow = parseInt(nextMove.charAt(1));
        nextMoveData.moveType = "move";
        if(isNaN(nextMoveData.moveRow)){
          nextMoveData.isError = true;
        }
        if(!nextMoveData.isError){
          if((nextMoveData.moveRow === 4 && nextMoveData.moveSide === "w") || (nextMoveData.moveRow === 5 && nextMoveData.moveSide === "b")){
            nextMoveData.moveMaybe = "move2Squares";
          }
        }
      } else if(nextMove.length === 3){
          if(nextMove === "0-0"){
            nextMoveData.movePieceType = "K,R";
            nextMoveData.moveColumn = nextMoveData.moveSide === "w" ? 1 : 8;
            nextMoveData.moveRow = "g,f";
            nextMoveData.moveType = "castle";
          }else{
            nextMoveData.moveType = "move";
            nextMoveData.movePieceType = nextMove.charAt(0);
            nextMoveData.moveColumn = nextMove.charAt(1);
            nextMoveData.moveRow = parseInt(nextMove.charAt(2));
            if(isNaN(nextMoveData.moveRow)){
              nextMoveData.isError = true;
            }
          }
      }else{
        // to be continued
        nextMoveData.isError = true;
      }
      // will update the board positions
      // update the state
      // recurse on moveGameTo = (askedMove)
    }
    return nextMoveData;
  }

export {getMoveOffset,getAskedMove,getNextMove};
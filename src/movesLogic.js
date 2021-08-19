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
      moveColumn : "",
      moveRow : 0,
      movePieceType : null,
      moveType : null, // move, castle-king, take
      isCheck : false, // maybe not usefull
      isMat : false,
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

      nextMove = nextMove.replace(/\?|!/,"") // no ?! !! etc...
      
      if(nextMove.charAt(nextMove.length-1) === "+" && nextMove.charAt(nextMove.length-2) === "+"){
        nextMove.isMat = true;
        nextMove = nextMove.substring(0,nextMove.length-2);
      }else if(nextMove.charAt(nextMove.length-1) === "+"){
        nextMove.isCheck = true;
        nextMove = nextMove.substring(0,nextMove.length-1);
      }
      if(nextMove.length === 2){// pawn move
        nextMoveData.movePieceType = "p";
        nextMoveData.moveColumn = nextMove.charAt(0);
        nextMoveData.moveRow = parseInt(nextMove.charAt(1));
        nextMoveData.possiblePositions = [];
        if((nextMoveData.moveRow === 4 && nextMoveData.moveSide === "w")){
          nextMoveData.possiblePositions.push({"column":nextMoveData.moveColumn,"row":3});
          nextMoveData.possiblePositions.push({"column":nextMoveData.moveColumn,"row":2});

        }else if(nextMoveData.moveRow === 5 && nextMoveData.moveSide === "b"){
          nextMoveData.possiblePositions.push({"column":nextMoveData.moveColumn,"row":7});
          nextMoveData.possiblePositions.push({"column":nextMoveData.moveColumn,"row":6}); 
        }else{
          nextMoveData.possiblePositions.push({"column":nextMoveData.moveColumn,"row":nextMoveData.moveSide === "w"?nextMoveData.moveRow++ :nextMoveData.moveRow-- });
        }
        nextMoveData.moveType = "move";
        if(isNaN(nextMoveData.moveRow)){
          nextMoveData.isError = true;
        }
      } else if(nextMove.length === 3){
          if(nextMove === "0-0"){
            nextMoveData.movePieceType = "K";
            nextMoveData.moveColumn = nextMoveData.moveSide === "w" ? 1 : 8;
            nextMoveData.moveRow = "g";
            nextMoveData.moveType = "castle-king";
            nextMoveData.possiblePositions = [];
            nextMoveData.additionalMove = {
              moveSide:nextMoveData.moveSide,
              moveColumn : nextMoveData.moveColumn,
              moveRow : "f",
              movePieceType : "R",
              moveType : nextMoveData.moveType,
              isCheck : false, // maybe not usefull
              isError : false
            }
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
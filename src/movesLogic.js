

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

  const getNextMove = (gamePositions,currentMove,askedMove,columnsOrdered) => {
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
      isError : false,
      isDone : true, // no change : we are at the asked move
      possiblePositions : [],
      additionalMove : null,
      comingFromRow : 0, // ex R2c8 => 2 : the Rook is coming from row 2 (there are 2 Rooks able to make teh move)
      comingFromColumn : "",// ex Rac8 => a : the Rook is coming from column/file "a"
      uniqueFigure:false,
      number:0
    };

    if(askedMoveOffset > currentMoveOffset){
      nextMoveData.isDone = false;
      let nextMoveOffset = currentMoveOffset === 0 ? currentMoveOffset = 1 : currentMoveOffset+1;
      let nextMovePosition = {}
      if(nextMoveOffset % 2 === 1){
        nextMovePosition.number = Math.trunc(currentMoveOffset/2)+1;
        nextMovePosition.side = "w";
      }else{
        nextMovePosition.number = (currentMoveOffset+1)/2;
        nextMovePosition.side = "b";
      }
      
      let nextMove = gamePositions[nextMovePosition.number-1][nextMovePosition.side];
      nextMoveData.moveSide = nextMovePosition.side;
      nextMoveData.number = nextMovePosition.number;
      nextMove = nextMove.replace(/\?|!/,"") // no ?! !! etc...

      nextMoveData.moveType = "move";
      
      let take = nextMove.indexOf("x") !== -1;
      if(take){
        nextMove = nextMove.replace("x","");
        nextMoveData.moveType = "take";
      }
      
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
        if(isNaN(nextMoveData.moveRow)){
          nextMoveData.isError = true;
        }
      } else if(nextMove.length === 3){
          if(nextMove === "0-0" || nextMove === "O-O"){
            nextMoveData.movePieceType = "K";
            nextMoveData.moveColumn = "g"
            nextMoveData.moveRow = nextMoveData.moveSide === "w" ? 1 : 8;
            nextMoveData.moveType = "castle-king";
            nextMoveData.possiblePositions = [];
            nextMoveData.additionalMove = {
              moveSide:nextMoveData.moveSide,
              moveColumn : "f",
              moveRow :  nextMoveData.moveRow,
              movePieceType : "R",
              moveType : nextMoveData.moveType,
              isCheck : false, // maybe not usefull
              isError : false,
              possiblePositions : []
            }
          }else{
            let isLowerCase = charIsLowercase(nextMove.charAt(0))
            if(isLowerCase){ // it's a pawn with an indication from which column/file it's coming
              nextMoveData.movePieceType = "p";
              nextMoveData.comingFromColumn = nextMove.charAt(0);
              nextMoveData.moveColumn = nextMove.charAt(1);
              nextMoveData.moveRow = parseInt(nextMove.charAt(2));
            }else{ // it's a Figure
              nextMoveData.movePieceType = nextMove.charAt(0);
              nextMoveData.moveColumn = nextMove.charAt(1);
              nextMoveData.moveRow = parseInt(nextMove.charAt(2));
            }
            if(isNaN(nextMoveData.moveRow)){
              nextMoveData.isError = true;
            }
          }
      }else if(nextMove.length === 4){
        nextMoveData.movePieceType = nextMove.charAt(0);
        let comingFrom = nextMove.charAt(1);
        if(!isNaN(parseInt(comingFrom))){
          nextMoveData.comingFromRow = parseInt(comingFrom);
        }else{
          nextMoveData.comingFromColumn = comingFrom;
        }
        nextMoveData.moveColumn = nextMove.charAt(2);
        nextMoveData.moveRow = parseInt(nextMove.charAt(3));
        if(isNaN(nextMoveData.moveRow)){
          nextMoveData.isError = true;
        }
      }else if(nextMove === "0-0-0" || nextMove === "O-O-O"){
        nextMoveData.movePieceType = "K";
        nextMoveData.moveColumn = "c";
        nextMoveData.moveRow = nextMoveData.moveSide === "w" ? 1 : 8;
        nextMoveData.moveType = "castle-queen";
        nextMoveData.possiblePositions = [];
        nextMoveData.additionalMove = {
          moveSide:nextMoveData.moveSide,
          moveColumn : "d",
          moveRow : nextMoveData.moveRow,
          movePieceType : "R",
          moveType : nextMoveData.moveType,
          isCheck : false, 
          isError : false,
          possiblePositions : []
        }
      }else{
        // to be continued (queen side castling)
        nextMoveData.isError = true;
      }
      // Computing possible previous positions of the moving piece 
      if(!nextMoveData.isError){
        nextMoveData.possiblePositions = [];
        if(nextMoveData.movePieceType === "p"){
          setPawnPossiblePreviousPositions(nextMoveData,columnsOrdered);
        }else if(nextMoveData.movePieceType === "N"){
          setKnightPossiblePreviousPositions(nextMoveData,columnsOrdered);
        }else if(nextMoveData.movePieceType === "B"){
          setBishopPossiblePreviousPositions(nextMoveData,columnsOrdered);
        }else if(nextMoveData.movePieceType === "R"){
          setRookPossiblePreviousPositions(nextMoveData,columnsOrdered);
        }else if(nextMoveData.movePieceType === "K"){
          setKingPossiblePreviousPositions(nextMoveData,columnsOrdered);
         } else if (nextMoveData.movePieceType === "Q") {
           nextMoveData.uniqueFigure = true;
         }
      }
    }

    nextMoveData.moveType = "move";
    return nextMoveData;
  }

// Private functions
  
const charIsLowercase = (c) => {
  return c !== c.toUpperCase();
}

const setRookPossiblePreviousPositions = (nextMoveData,columnsOrdered) => {
  let rowPos = nextMoveData.moveRow;// starts at 1
  let colPos = columnsOrdered.indexOf(nextMoveData.moveColumn);
  
   // each +1 row 
  for (let r = rowPos + 1; r < 9; r++) {
    let possibleMove = {
      "column": colPos+1,
      "row": r
    };
    if ((nextMoveData.comingFromRow === 0 || possibleMove.row === nextMoveData.comingFromRow) &&
      (nextMoveData.comingFromColumn === "" || possibleMove.column === nextMoveData.comingFromColumn)) {
      nextMoveData.possiblePositions.push(possibleMove);
    }
  }
  // each -1 row 
  for (let r = rowPos - 1; r < 0; r--) {
    let possibleMove = {
      "column": colPos+1,
      "row": r
    };
    if ((nextMoveData.comingFromRow === 0 || possibleMove.row === nextMoveData.comingFromRow) &&
      (nextMoveData.comingFromColumn === "" || possibleMove.column === nextMoveData.comingFromColumn)) {
      nextMoveData.possiblePositions.push(possibleMove);
    }
  }
  // each +1 col
    for (let c = colPos + 1; c < 9; c++) {
      let possibleMove = {
        "column": columnsOrdered[c-1],
        "row": rowPos 
      };
      if ((nextMoveData.comingFromRow === 0 || possibleMove.row === nextMoveData.comingFromRow) &&
        (nextMoveData.comingFromColumn === "" || possibleMove.column === nextMoveData.comingFromColumn)) {
        nextMoveData.possiblePositions.push(possibleMove);
      }
    }
  // each -1 col
  for (let c = colPos - 1; c < 0; c--) {
    let possibleMove = {
      "column": columnsOrdered[c-1],
      "row": rowPos 
    };
    if ((nextMoveData.comingFromRow === 0 || possibleMove.row === nextMoveData.comingFromRow) &&
      (nextMoveData.comingFromColumn === "" || possibleMove.column === nextMoveData.comingFromColumn)) {
      nextMoveData.possiblePositions.push(possibleMove);
    }
  }
}

const setKingPossiblePreviousPositions = (nextMoveData,columnsOrdered) => {

  if (nextMoveData.moveType === "castle-king") {
    nextMoveData.possiblePositions.push({
      "column": "e",
      "row": nextMoveData.moveSide === "w" ? 1 : 8
    });
    nextMoveData.additionalMove.possiblePositions.push({
      "column": "h",
      "row": nextMoveData.moveSide === "w" ? 1 : 8
    });
    nextMoveData.moveType = "move";
    nextMoveData.additionalMove.moveType = "move";
  } else if (nextMoveData.moveType === "castle-queen") {
    nextMoveData.possiblePositions.push({
      "column": "e",
      "row": nextMoveData.moveSide === "w" ? 1 : 8
    });
    nextMoveData.additionalMove.possiblePositions.push({
      "column": "a",
      "row": nextMoveData.moveSide === "w" ? 1 : 8
    });
    nextMoveData.moveType = "move";
    nextMoveData.additionalMove.moveType = "move";

  } else {
    nextMoveData.uniqueFigure = true;
  }
}

const setPawnPossiblePreviousPositions = (nextMoveData,columnsOrdered) => {
  if (nextMoveData.moveRow === 4 && nextMoveData.moveSide === "w" && nextMoveData.moveType === "move") {
    nextMoveData.possiblePositions.push({
      "column": nextMoveData.moveColumn,
      "row": 3
    });
    nextMoveData.possiblePositions.push({
      "column": nextMoveData.moveColumn,
      "row": 2
    });
  } else if (nextMoveData.moveRow === 5 && nextMoveData.moveSide === "b" && nextMoveData.moveType === "move") {
    nextMoveData.possiblePositions.push({
      "column": nextMoveData.moveColumn,
      "row": 7
    });
    nextMoveData.possiblePositions.push({
      "column": nextMoveData.moveColumn,
      "row": 6
    });
  } else if (nextMoveData.moveType === "move") {
    nextMoveData.possiblePositions.push({
      "column": nextMoveData.moveColumn,
      "row": nextMoveData.moveSide === "w" ? nextMoveData.moveRow - 1 : nextMoveData.moveRow + 1
    });
  } else if (nextMoveData.moveType === "take") {
    // toDo : en passant

    // mundane take :
    if (nextMoveData.comingFromColumn !== "") {
      nextMoveData.possiblePositions.push({
        "column": nextMoveData.comingFromColumn,
        "row": nextMoveData.moveSide === "w" ? nextMoveData.moveRow - 1 : nextMoveData.moveRow + 1
      });
    } else {
      let posMoveColumn = columnsOrdered.indexOf(nextMoveData.moveColumn);
      if (posMoveColumn === 0) { // pawn takes on "a" file : only one possibility, it's on "b" file
        nextMoveData.possiblePositions.push({
          "column": columnsOrdered[1],
          "row": nextMoveData.moveSide === "w" ? nextMoveData.moveRow - 1 : nextMoveData.moveRow + 1
        });
      } else if (posMoveColumn === 7) { // pawn takes on "h" file : only one possibility, it's on "g" file
        nextMoveData.possiblePositions.push({
          "column": columnsOrdered[6],
          "row": nextMoveData.moveSide === "w" ? nextMoveData.moveRow - 1 : nextMoveData.moveRow + 1
        });
      } else { // 2 possibilities the pawn is either coming from the left side or the right side of the taken piece column
        nextMoveData.possiblePositions.push({
          "column": columnsOrdered[posMoveColumn - 1],
          "row": nextMoveData.moveSide === "w" ? nextMoveData.moveRow - 1 : nextMoveData.moveRow + 1
        });
        nextMoveData.possiblePositions.push({
          "column": columnsOrdered[posMoveColumn + 1],
          "row": nextMoveData.moveSide === "w" ? nextMoveData.moveRow - 1 : nextMoveData.moveRow + 1
        });
      }
    }
  } else {
    nextMoveData.isError = true;
  }
}

const setBishopPossiblePreviousPositions = (nextMoveData,columnsOrdered) => {
 // diagonally
 let rowPos = nextMoveData.moveRow;// starts at 1
 let convenientShift = 1;
 let colPos = columnsOrdered.indexOf(nextMoveData.moveColumn) + convenientShift; // starts at 0

  // each +1 row +1 col
let c = colPos + 1;
let r = rowPos + 1;
for (let i = 0; i < 9; i++) {
  if (c < 9 && r < 9) {
    let possibleMove = {
      "column": columnsOrdered[c - convenientShift],
      "row": r
    };
    if ((nextMoveData.comingFromRow === 0 || possibleMove.row === nextMoveData.comingFromRow) &&
      (nextMoveData.comingFromColumn === "" || possibleMove.column === nextMoveData.comingFromColumn)) {
      nextMoveData.possiblePositions.push(possibleMove);
    }
  }
  c++;
  r++;
}

 // each +1 row -1 col
 c = colPos - 1;
 r = rowPos + 1;
 for (let i = 0; i < 9; i++) {
   if (c > 0 && r < 9) {
     let possibleMove = {
       "column": columnsOrdered[c - convenientShift],
       "row": r
     };
     if ((nextMoveData.comingFromRow === 0 || possibleMove.row === nextMoveData.comingFromRow) &&
       (nextMoveData.comingFromColumn === "" || possibleMove.column === nextMoveData.comingFromColumn)) {
       nextMoveData.possiblePositions.push(possibleMove);
     }
   }
   c--;
   r++;
 }
 // each -1 row +1 col
 c = colPos + 1;
 r = rowPos - 1;
 for (let i = 0; i < 9; i++) {
  if (c <  9 && r > 0) {
    let possibleMove = {
      "column": columnsOrdered[c - convenientShift],
      "row": r
    };
    if ((nextMoveData.comingFromRow === 0 || possibleMove.row === nextMoveData.comingFromRow) &&
      (nextMoveData.comingFromColumn === "" || possibleMove.column === nextMoveData.comingFromColumn)) {
      nextMoveData.possiblePositions.push(possibleMove);
    }
  }
  c++;
  r--;
}
 // each -1 row -1 col
 c = colPos-1;
 r = rowPos-1;
  for(let i = 8 ;i > 0; i--){
     if (c > 0 && c > 0) {
       let possibleMove = {
         "column": columnsOrdered[c - convenientShift],
         "row": r
       };
       if ((nextMoveData.comingFromRow === 0 || possibleMove.row === nextMoveData.comingFromRow) &&
         (nextMoveData.comingFromColumn === "" || possibleMove.column === nextMoveData.comingFromColumn)) {
         nextMoveData.possiblePositions.push(possibleMove);
       }
     }
     c--;
     r--;
  }
}

const setKnightPossiblePreviousPositions = (nextMoveData,columnsOrdered) => {
        // either 2 rows and 1 column aside or 1 row and 2 col aside
        let rowPos = nextMoveData.moveRow;// starts at 1
        let convenientShift = 1;
        let colPos = columnsOrdered.indexOf(nextMoveData.moveColumn) + convenientShift; // starts at 1
        // - 2 row - 1 col
        if(rowPos - 2 > 0 && colPos - 1 > 0){
          let possibleMove = {"column":columnsOrdered[colPos - 1 - convenientShift],"row":rowPos - 2};
          if((nextMoveData.comingFromRow === 0 || possibleMove.row === nextMoveData.comingFromRow ) 
          && (nextMoveData.comingFromColumn === "" || possibleMove.column === nextMoveData.comingFromColumn )){
            nextMoveData.possiblePositions.push(possibleMove);
          }
        }
        // - 2 row + 1 col
        if(rowPos - 2 > 0 && colPos + 1 < 9){
          let possibleMove = {"column":columnsOrdered[colPos + 1 - convenientShift],"row":rowPos - 2};
          if((nextMoveData.comingFromRow === 0 || possibleMove.row === nextMoveData.comingFromRow ) 
          && (nextMoveData.comingFromColumn === "" || possibleMove.column === nextMoveData.comingFromColumn )){
            nextMoveData.possiblePositions.push(possibleMove);
          }
        }
        // + 2 row - 1 col
        if(rowPos + 2 < 9 && colPos - 1 > 0){
          let possibleMove = {"column":columnsOrdered[colPos - 1 - convenientShift],"row":rowPos + 2};
          if((nextMoveData.comingFromRow === 0 || possibleMove.row === nextMoveData.comingFromRow ) 
          && (nextMoveData.comingFromColumn === "" || possibleMove.column === nextMoveData.comingFromColumn )){
            nextMoveData.possiblePositions.push(possibleMove);
          }
        }
        // + 2 row + 1 col
        if(rowPos + 2 < 9 && colPos + 1 < 9){
          let possibleMove = {"column":columnsOrdered[colPos + 1 - convenientShift],"row":rowPos + 2};
          if((nextMoveData.comingFromRow === 0 || possibleMove.row === nextMoveData.comingFromRow ) 
          && (nextMoveData.comingFromColumn === "" || possibleMove.column === nextMoveData.comingFromColumn )){
            nextMoveData.possiblePositions.push(possibleMove);
          }
        }
        // - 1 row - 2 col
        if(rowPos - 1 > 0 && colPos - 2 > 0){
          let possibleMove = {"column":columnsOrdered[colPos - 2 - convenientShift],"row":rowPos - 1};
          if((nextMoveData.comingFromRow === 0 || possibleMove.row === nextMoveData.comingFromRow ) 
          && (nextMoveData.comingFromColumn === "" || possibleMove.column === nextMoveData.comingFromColumn )){
            nextMoveData.possiblePositions.push(possibleMove);
          }
        }
        // - 1 row + 2 col
        if(rowPos - 1 > 0 && colPos + 2 < 9){
          let possibleMove = {"column":columnsOrdered[colPos + 2 - convenientShift],"row":rowPos - 1};
          if((nextMoveData.comingFromRow === 0 || possibleMove.row === nextMoveData.comingFromRow ) 
          && (nextMoveData.comingFromColumn === "" || possibleMove.column === nextMoveData.comingFromColumn )){
            nextMoveData.possiblePositions.push(possibleMove);
          }
        }
        // + 1 row - 2 col
        if(rowPos + 1 < 9 && colPos - 2 > 0){
          let possibleMove = {"column":columnsOrdered[colPos - 2 - convenientShift],"row":rowPos + 1};
          if((nextMoveData.comingFromRow === 0 || possibleMove.row === nextMoveData.comingFromRow ) 
          && (nextMoveData.comingFromColumn === "" || possibleMove.column === nextMoveData.comingFromColumn )){
            nextMoveData.possiblePositions.push(possibleMove);
          }
        }
        // + 1 row + 2 col
        if(rowPos + 1 < 9 && colPos + 2 < 9){
          let possibleMove = {"column":columnsOrdered[colPos + 2 - convenientShift],"row":rowPos + 1};
          if((nextMoveData.comingFromRow === 0 || possibleMove.row === nextMoveData.comingFromRow ) 
          && (nextMoveData.comingFromColumn === "" || possibleMove.column === nextMoveData.comingFromColumn )){
            nextMoveData.possiblePositions.push(possibleMove);
          }
        }

}

const getMoveOffset = (move) => {
  return move.number === 0 ? 0 : ((move.number-1)*2) + (move.side === "w" ? 1 : 2);
}

export {getMoveOffset,getAskedMove,getNextMove};
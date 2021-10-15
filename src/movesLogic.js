import {charIsLowercase} from './utils.js';

const getAskedMove = (elem,currentMove,movesList) => {
    let turn = 0;
    let side = "w";
    let askedMove = null;
    let lastMove = movesList[movesList.length-1];
    if("move" in elem){
      let instruction = elem.move;
      if(instruction === "first"){
        askedMove={"number":0,"side":"w"};
      }else if(instruction === "last"){
        if("b" in lastMove){
          askedMove={"number":movesList.length,"side":"b"};
        }else{
          askedMove={"number":movesList.length,"side":"w"};
        }
        askedMove.pace = "quick";
      }else if(instruction === "pause"){
        askedMove=currentMove;
        askedMove.pace = "stop";
      }else if(instruction === "prev"){
        if(currentMove.number <= 1 && currentMove.side === "w"){
          askedMove={"number":0,"side":"w"};
        }else{
          if(currentMove.side === "b"){
            askedMove={"number":currentMove.number,"side":"w"};
          }else{
            askedMove={"number":currentMove.number -1 ,"side":"b"};
          }
          if(askedMove.number < 1 ){
            askedMove={"number":1,"side":"w"};
          }
        }
        askedMove.pace = "quick";
      }else if(instruction === "next"){
        if(currentMove.number === movesList.length){
          if(currentMove.side === "b"){
            askedMove=currentMove;
          }else{
            if("b" in lastMove){
              askedMove={"number":movesList.length ,"side":"b"};
            }else{
              askedMove=currentMove;
            }
          }
        }else{
          if(currentMove.side === "b"){
            askedMove={"number":currentMove.number +1,"side":"w"};
          }else{
            askedMove={"number":currentMove.number ,"side":"b"};
          }
        }

        if(askedMove.number < 1 ){
          askedMove={"number":1,"side":"w"};
        }
      }
    }

    else if("turn" in elem && "side" in elem){
      turn = parseInt(elem.turn);
      if(isNaN(turn)){
        turn = 0;
      }
      side = elem.side;
    }
    if(turn>0){
      askedMove={"number":turn,"side":side};
    }
    return askedMove;
  }

  const getNextMove = (gameMoves,currentMove,askedMove,columnsOrdered,boardPositions) => {
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
      promoteTo:null,
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
      
      let nextMove = gameMoves[nextMovePosition.number-1][nextMovePosition.side];
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
        nextMoveData.isMat = true;
        nextMove = nextMove.substring(0,nextMove.length-2);
      }else if(nextMove.charAt(nextMove.length-1) === "+"){
        nextMoveData.isCheck = true;
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
        if(nextMove.charAt(2) === "="){
          nextMoveData.promoteTo = nextMove.charAt(3);
          nextMoveData.movePieceType = "p";
          nextMoveData.moveColumn = nextMove.charAt(0);
          nextMoveData.moveRow = parseInt(nextMove.charAt(1));
        }else{
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
          setRookPossiblePreviousPositions(nextMoveData,columnsOrdered,boardPositions);
        }else if(nextMoveData.movePieceType === "K"){
          setKingPossiblePreviousPositions(nextMoveData,columnsOrdered);
         } else if (nextMoveData.movePieceType === "Q") {
           nextMoveData.uniqueFigure = true;
         }
      }
    }

    return nextMoveData;
  }

  const getMoveDataAt = (turn,side,nr,positions,columnsOrdered) => {
    let nextMoveData = {
      moveSide:side,
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
      promoteTo:null,
      number:nr
    };

      nextMoveData.isDone = false;

      let nextMove = side === "w" ? turn.w : turn.b;
      nextMove = nextMove.replace(/\?|!/,"") // no ?! !! etc...
      nextMoveData.moveType = "move";
      
      let take = nextMove.indexOf("x") !== -1;
      if(take){
        nextMove = nextMove.replace("x","");
        nextMoveData.moveType = "take";
      }
      
      if(nextMove.charAt(nextMove.length-1) === "+" && nextMove.charAt(nextMove.length-2) === "+"){
        nextMoveData.isMat = true;
        nextMove = nextMove.substring(0,nextMove.length-2);
      }else if(nextMove.charAt(nextMove.length-1) === "+"){
        nextMoveData.isCheck = true;
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
        if(nextMove.charAt(2) === "="){
          nextMoveData.promoteTo = nextMove.charAt(3);
          nextMoveData.movePieceType = "p";
          nextMoveData.moveColumn = nextMove.charAt(0);
          nextMoveData.moveRow = parseInt(nextMove.charAt(1));
        }else{
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
          setRookPossiblePreviousPositions(nextMoveData,columnsOrdered,positions);
        }else if(nextMoveData.movePieceType === "K"){
          setKingPossiblePreviousPositions(nextMoveData,columnsOrdered);
         } else if (nextMoveData.movePieceType === "Q") {
           nextMoveData.uniqueFigure = true;
         }
      }

    return nextMoveData;
  }


  const setRookPossiblePreviousPositions = (nextMoveData, columnsOrdered, boardPositions) => {
    // the rooks don"t "jump" over other pieces like knights and unlike bishops they can go on both colors's squares
    // We can check obstacles with boardPositions
    // Same column 
    // changing row
    let searchedFigure = "R" + nextMoveData.moveSide.toUpperCase();
  
    // Let's find rooks on the board before we move
    let rooks = boardPositions.filter((x) => {
      return x.fig === searchedFigure
      // && nextMoveData.comingFromColumn !== "" ? x.column === nextMoveData.comingFromColumn : true && nextMoveData.comingFromRow !== 0 ? x.row === nextMoveData.comingFromRow : true;
    });
  
    // put theses positions in an array of possible movesn
    if (rooks.length === 0 || rooks.length > 2) {
      nextMoveData.isError = true;
    }
  
    if (rooks.length === 2) {
      if(nextMoveData.comingFromColumn !== ""){
        rooks = rooks.filter((x) => {
          return x.column === nextMoveData.comingFromColumn;
        });
      }
      if(nextMoveData.comingFromRow !== 0){
        rooks = rooks.filter((x) => {
          return x.row === nextMoveData.comingFromRow;
        });
      }
    }
  
    if (rooks.length === 1) {
      nextMoveData.possiblePositions.push({
        "column": rooks[0].column,
        "row": rooks[0].row
      });
    }
  
    if (rooks.length === 2) {
      let rookPrev1 = { column: rooks[0].column, row: rooks[0].row };
      let rookPrev2 = { column: rooks[1].column, row: rooks[1].row };
      let rookNext = { column: nextMoveData.moveColumn, row: nextMoveData.moveRow };
      // Test rookPrev1 towards rookNext :
      let prev1Possible = rookPrev1.row === rookNext.row || rookPrev1.column === rookNext.column;
      let prev2Possible = rookPrev2.row === rookNext.row || rookPrev2.column === rookNext.column;
      if (prev1Possible) {
        // same column : check obstacles on rows between
        if (rookPrev1.column === rookNext.column) {
          let from = Math.min(rookPrev1.row ,rookNext.row);
          let to = Math.max(rookPrev1.row ,rookNext.row);
          for(let i = from;i <= to;i++){
            let obstacle = boardPositions.filter((x) => {
              return x.fig != null && x.column === rookNext.column && x.row === i && x.row !== rookPrev1.row;
            });
            if(obstacle.length !== 0){
              prev1Possible = false;
              break;
            }
          }
        } else if (rookPrev1.row === rookNext.row) {
          // same row : check obstacles on columns between
          let from = Math.min(columnsOrdered.indexOf(rookPrev1.column) ,columnsOrdered.indexOf(rookNext.column));
          let to = Math.max(columnsOrdered.indexOf(rookPrev1.column) ,columnsOrdered.indexOf(rookNext.column));
          for(let i = from;i <= to;i++){
            let obstacle = boardPositions.filter((x) => {
              return x.fig != null && x.row === rookNext.row && columnsOrdered.indexOf(x.column) === i && x.column !== rookPrev1.column;
            });
            if(obstacle.length !== 0){
              prev1Possible = false;
              break;
            }
          }
        }
      }
      if (!prev1Possible && prev2Possible) {
        // same column : check obstacles on rows between
        if (rookPrev2.column === rookNext.column) {
          let from = Math.min(rookPrev2.row ,rookNext.row) ;
          let to = Math.max(rookPrev2.row ,rookNext.row);
          for(let i = from;i <= to;i++){
            let obstacle = boardPositions.filter((x) => {
              return x.fig != null && x.column === rookNext.column && x.row === i && x.row !== rookPrev2.row;
            });
            if(obstacle.length !== 0){
              prev2Possible = false;
              break;
            }
          }
        } else if (rookPrev2.row === rookNext.row) {
          // same row : check obstacles on columns between
          let from = Math.min(columnsOrdered.indexOf(rookPrev2.column) ,columnsOrdered.indexOf(rookNext.column));
          let to = Math.max(columnsOrdered.indexOf(rookPrev2.column) ,columnsOrdered.indexOf(rookNext.column));
          for(let i = from;i <= to;i++){
            let obstacle = boardPositions.filter((x) => {
              return x.fig != null && x.row === rookNext.row && columnsOrdered.indexOf(x.column) === i && x.column !== rookPrev2.column;
            });
            if(obstacle.length !== 0){
              prev2Possible = false;
              break;
            }
          }
        }
      }
      if(prev1Possible){
        nextMoveData.possiblePositions.push({
          "column": rookPrev1.column,
          "row": rookPrev1.row
        });
      }
      if(prev2Possible){
        nextMoveData.possiblePositions.push({
          "column": rookPrev2.column,
          "row": rookPrev2.row
        });
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
        //setEnPassantLeftSide(nextMoveData,columnsOrdered,posMoveColumn);
      } else if (posMoveColumn === 7) { // pawn takes on "h" file : only one possibility, it's on "g" file
        nextMoveData.possiblePositions.push({
          "column": columnsOrdered[6],
          "row": nextMoveData.moveSide === "w" ? nextMoveData.moveRow - 1 : nextMoveData.moveRow + 1
        });
        //setEnPassantRightSide(nextMoveData,columnsOrdered,posMoveColumn);
      } else { // 2 possibilities the pawn is either coming from the left side or the right side of the taken piece column
        nextMoveData.possiblePositions.push({
          "column": columnsOrdered[posMoveColumn - 1],
          "row": nextMoveData.moveSide === "w" ? nextMoveData.moveRow - 1 : nextMoveData.moveRow + 1
        });
        //setEnPassantLeftSide(nextMoveData,columnsOrdered,posMoveColumn);
        nextMoveData.possiblePositions.push({
          "column": columnsOrdered[posMoveColumn + 1],
          "row": nextMoveData.moveSide === "w" ? nextMoveData.moveRow - 1 : nextMoveData.moveRow + 1
        });
        //setEnPassantRightSide(nextMoveData,columnsOrdered,posMoveColumn);
      }
    }
  } else {
    nextMoveData.isError = true;
  }
}

const setBishopPossiblePreviousPositions = (nextMoveData,columnsOrdered) => {
 // diagonally : bishops stay always on the same color so we alway find the good one !
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
        // we don't have to car about obstacles on the way as knights "jump" over the pawns and pieces
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
const pngToTurns = (pgnGame) => {
  let turns = [];
  let turn = 1;
  let turnPrevPosition =  pgnGame.indexOf(turn+".");
  let turnNextPosition = 0;
  let currentTurnData;
  let end;
  while (turnPrevPosition !== -1 && turnNextPosition !== -1){
    turnNextPosition =  pgnGame.indexOf((turn+1)+".");
    if(turnNextPosition !==-1){
      end = turnNextPosition;
    }else{
      end = turnPrevPosition + 100;
    }
      currentTurnData = pgnGame.substring(turnPrevPosition, end).replace(turn+".","").trim();
      let moves = currentTurnData.split(" ");
      let turnInfo = {"w":moves[0]};
      if(moves.length === 2){
        turnInfo.b = moves[1];
      }
      turns.push(turnInfo);
      turnPrevPosition = turnNextPosition;
    turn++;
  } 
  return turns;
}

const pngToInfos = (infos) => {
  infos = infos.split(",");
  let infosClean = {};
  infos.forEach(function(raw){
    let clean = raw.replace(/\\|\[|\]|"/g, "");
    let pos = clean.indexOf(" ");
    if(pos !== -1){
      let key = clean.substring(0,pos);
      let value = clean.substring(pos+1,clean.length);
      infosClean[key] = value;
    }
  });
  return infosClean;
}

const getMoveOffset = (move) => {
  return move.number === 0 ? 0 : ((move.number-1)*2) + (move.side === "w" ? 1 : 2);
}

const boardToScore = (data) => {
  let scores = {
    "whiteScore" : 0,
    "blackScore" : 0,
    "whiteJail" : [],
    "blackJail" : []
  }
  let scoreWhite = 0;
  let scoreBlack = 0;
  let figs = ["p","R","B","N","Q"];
  let figsValues = [1,5,3,3,9];

  let whiteTeam = {
    "p": 0, 
    "R": 0, 
    "B": 0, 
    "N": 0, 
    "Q": 0
  }
  
  let blackTeam = {
    "p": 0, 
    "R": 0, 
    "B": 0, 
    "N": 0, 
    "Q": 0
  }

  let originalTeam = {
    "p": 8, 
    "R": 2, 
    "B": 2, 
    "N": 2, 
    "Q": 1
  }

  data.forEach((x,i) => {
      if(x.fig !== null){
          let figure = x.fig.charAt(0);
          let pos = figs.indexOf(figure);
          if(pos !== -1){
              if( x.fig.charAt(1)==="W"){
                  whiteTeam[figure] +=1;
                  scoreWhite+=figsValues[pos];
              }else{
                  blackTeam[figure] +=1;
                  scoreBlack+=figsValues[pos];
              }
          }
      }
  })

  scores.whiteScore = scoreWhite - scoreBlack;
  scores.blackScore = scoreBlack - scoreWhite;

  for (const item in whiteTeam) {
    let nr = originalTeam[item] - whiteTeam[item];
    for (let i = 0; i < nr; i++) {
      scores.blackJail.push(item);
    }
  }

  for (const item in blackTeam) {
    let nr = originalTeam[item] - blackTeam[item];
    for (let i = 0; i < nr; i++) {
      scores.whiteJail.push(item);
    }
  }
  return scores;
}
     
const getPositionsAt = (nextMoveData, gamePositions) => {
  if (!nextMoveData.isError && !nextMoveData.isDone) {
    let hasMoved = false;
    if (nextMoveData.possiblePositions && nextMoveData.possiblePositions.length > 0) {
      for (let i = 0; i < nextMoveData.possiblePositions.length; i++) {
        if (hasMoved) break;
        for (let j = 0; j < gamePositions.length; j++) {
          if (gamePositions[j].column === nextMoveData.possiblePositions[i].column && gamePositions[j].row === nextMoveData.possiblePositions[i].row) {
            if (gamePositions[j].fig === (nextMoveData.movePieceType + nextMoveData.moveSide.toUpperCase())) {
              hasMoved = true;
              gamePositions[j].fig = null;
              break;
            }
          }
        }
      }

      if (nextMoveData.additionalMove !== null) {
        let hasMovedKing = hasMoved;
        let hasMovedRook = false;
        for (let i = 0; i < gamePositions.length; i++) {
          // Rook
          if (gamePositions[i].column === nextMoveData.additionalMove.possiblePositions[0].column && gamePositions[i].row === nextMoveData.additionalMove.possiblePositions[0].row) {
            if (gamePositions[i].fig === nextMoveData.additionalMove.movePieceType + nextMoveData.additionalMove.moveSide.toUpperCase()) {
              hasMovedRook = true;
              gamePositions[i].fig = null;
            }
          }
        }
        hasMoved = hasMovedKing && hasMovedRook;
      }
    }
    if (nextMoveData.uniqueFigure === true) {
      for (let i = 0; i < gamePositions.length; i++) {
        if (gamePositions[i].fig === nextMoveData.movePieceType + nextMoveData.moveSide.toUpperCase()) {
          hasMoved = true;
          gamePositions[i].fig = null;
          break;
        }
      }
    }
    if (hasMoved) {
      for (let i = 0; i < gamePositions.length; i++) {
        if (gamePositions[i].column === nextMoveData.moveColumn && gamePositions[i].row === nextMoveData.moveRow) {
          if (nextMoveData.moveType === "take") {
            if (gamePositions[i].fig === null && nextMoveData.movePieceType === "p") { // En passant
              let delta = nextMoveData.moveSide === "w" ? 8 : -8;
              gamePositions[i + delta].fig = null;
            }
            gamePositions[i].fig = nextMoveData.movePieceType + nextMoveData.moveSide.toUpperCase();

          } else {
            gamePositions[i].fig = nextMoveData.promoteTo ? nextMoveData.promoteTo + nextMoveData.moveSide.toUpperCase() : nextMoveData.movePieceType + nextMoveData.moveSide.toUpperCase();
          }
          break;
        }
      }
      if (nextMoveData.additionalMove != null) {
        for (let i = 0; i < gamePositions.length; i++) {
          if (gamePositions[i].column === nextMoveData.additionalMove.moveColumn && gamePositions[i].row === nextMoveData.additionalMove.moveRow) {
            gamePositions[i].fig = nextMoveData.additionalMove.movePieceType + nextMoveData.additionalMove.moveSide.toUpperCase();
            break;
          }
        }
      }
    }
  }
  return gamePositions;
}

export {getMoveOffset,getAskedMove,getNextMove,pngToTurns,pngToInfos,getMoveDataAt,getPositionsAt,boardToScore};
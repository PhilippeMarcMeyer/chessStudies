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

export {getMoveOffset,getAskedMove};
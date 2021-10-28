import {ecoOpenings} from './openings.js'; 


const findOpeningByFen = (moveFen) => {
    let fenHead = moveFen.split(" ")[0];
    let possibleOpenings = ecoOpenings.filter((x) => {
        return x.fen === fenHead;       
    });
    return possibleOpenings;
}

const findOpeningByResume = (resume) => {
  let possibleOpenings = [];
  if(resume.opening !== ""){
    let possibleOpenings = ecoOpenings.filter((x) => {
        return x.opening === resume.opening;       
    });
    if(possibleOpenings.length === 0){
        possibleOpenings = [];
        possibleOpenings.push(
            {
                "ecoCode": "?",
                "opening": resume.opening,
                "moves":"openingMoves" in resume ? resume.openingMoves : "",
                "fen": ""
            }
        )
    }
  }
  return possibleOpenings;
}

const findOpeningByCode = (ecoCode) => {
    let possibleOpenings = ecoOpenings.filter((x) => {
        return x.ecoCode === ecoCode;
    });
    return possibleOpenings;
}

const findGamesByFen = (state,fen,move) => {
    let result = {"originalKey":state.gameKey,"move":move,games:null};
    let fenModelSearch = state.fenGame.filter((x)=>{
        return x.number === move.number && x.side === move.side;
    });
    if(fenModelSearch.length > 0){
        let fenModel = fenModelSearch[0].fen.split(" ")[0];
        if(state.games.length>0){
            let games = [];
            state.games.forEach((x)=>{
                let fens = x.fenGame.filter((f)=>{
                    return f.fen.indexOf(fenModel) !== -1 && x.id !== state.gameKey ;
                });
                if(fens.length > 0){
                    let digest = x.pgnResume.White + " vs " +  x.pgnResume.Black + " ["+x.pgnResume.Result+"] " + x.pgnResume.Date;
                    games.push({"key":x.id,"move":{"number":fens[0].number,"side":fens[0].side,"movesList":x.pgnGame},"digest":digest});
                }
            });
            result.games = games;
        }
    }
    return result;
}

const findOpeningsByName = (selectedOpening) => {
    let theOpenings = [];
    if(selectedOpening !== "all"){
        theOpenings = ecoOpenings.filter((x) => {
            return x.opening.indexOf(selectedOpening) !==-1;
        });
    }
    return theOpenings;
}
export {findOpeningByFen,findOpeningByCode,findGamesByFen,findOpeningByResume,findOpeningsByName};
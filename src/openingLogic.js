import {ecoOpenings} from './openings.js'; 


const findOpeningByFen = (moveFen) => {
    let fenHead = moveFen.split(" ")[0];
    let possibleOpenings = ecoOpenings.filter((x) => {
        return x.fen === fenHead;       
    });
    return possibleOpenings;
}

const findOpeningByCode = (ecoCode) => {
    let possibleOpenings = ecoOpenings.filter((x) => {
        return x.ecoCode === ecoCode;
    });
    return possibleOpenings;
}

export {findOpeningByFen,findOpeningByCode};
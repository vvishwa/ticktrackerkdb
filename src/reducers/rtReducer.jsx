import {types} from '../types/tickerTypes.jsx'

export default function rtReducer(state = {}, action) {
    let finalState = {...state}
    switch (action.type) {
      case types.REDUX_WEBSOCKET_MESSAGE:
        finalState = funcResponse(action.payload.message, state)
        break;
      default:
        console.log('rtReducer:DEFAULT occur')
        finalState = {...state};
    }

    console.log('rtReducer state = ', finalState, ', action = ',action)
    return finalState
}

const funcResponse = (msg, prevState) => {
    let tmp = JSON.parse(msg);
    let id = tmp[0];
    let fName = tmp[1];
    let fArgs = tmp[2];
    console.log('rtReducer: Whole response id['+id+'], fName['+fName+'], fArgs['+fArgs+']');
    
    let retValue = undefined;
    switch(fName) {
      case '.rt.subscribe':
        retValue = {...prevState, datedList:fArgs, };
        break;
      default:
        retValue = {...prevState};
        break;
    }
    console.log('rtReducer.funcResponse return value ', retValue);
    return retValue;
}
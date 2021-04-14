import {types} from '../types/tickerTypes.jsx'

export default function tickerReducer(state = {}, action) {
    const payload = action.payload;
    console.log('tickerReducer state = ', state, ', action = ',action)
    switch (action.type) {
      case types.REDUX_WEBSOCKET_MESSAGE:
        //console.log('action.payload.message', action.payload.message)
        return funcResponse(action.payload.message, state)
      case types.SELECT_TICKER: 
        return {
          selectedTicker: payload, ...state
        }
      default:
          return state;
    }
}

const funcResponse = (msg, prevState) => {
    let tmp = JSON.parse(msg);
    let id = tmp[0];
    let fName = tmp[1];
    let fArgs = tmp[2];
    console.log('Whole response id['+id+'], fName['+fName+'], fArgs['+fArgs+']');
    
    let retValue = undefined;
    switch(fName) {
      case '.eod.getTickers':
        retValue = {tickerList: fArgs, ...prevState};
        break;
      case '.eod.getExpirations':
        retValue = {expirations: fArgs, ...prevState};
        break;
      default:
        retValue = {...prevState};
        break;
    }
    console.log('tickerReducer.funcResponse return value ', retValue);
    return retValue;
}
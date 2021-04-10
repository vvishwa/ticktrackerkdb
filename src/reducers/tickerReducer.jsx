import {types} from '../types/tickerTypes.jsx'

export default function tickerReducer(state = {}, action) {
    const payload = action.payload;
    console.log('tickerReducer ',action)
    switch (action.type) {
      case types.REDUX_WEBSOCKET_MESSAGE:
        console.log('action.payload.message', action.payload.message)
        return funcResponse(action.payload.message)
      case types.INIT_TICKER:
        return {
            tickers: [
                initTicker(action.payload.message)
            ]
        };
      case types.NEW_TICKER:
        return {
            tickers: [
                ...state.tickers,
                newTicker(state.tickers, payload.ticker)
            ]
        };
      case types.DELETE_TICKER:
        return {
            tickers: deleteTicker(state.tickers, payload.ticker)
        };
      case types.SELECT_TICKER: 
        return {
          selectedTicker: payload
        }
      default:
          return state;
    }
}

const initTicker = () => {
  return {
    tickers: ['AAPL', 'IBM']
  }
}

const newTicker = (tickers, symbol) => {
  const newTickers = tickers.push(symbol);
  return {
    tickers: {newTickers}
  }
};

const deleteTicker = (tickers, symbol) => tickers.filter(f => f.symbol !== symbol);

const funcResponse = (msg) => {
  if (msg !== undefined) {
    let tmp = JSON.parse(msg);
    let id = tmp[0];
    let fName = tmp[1];
    let fArgs = tmp[2];
    console.log('Whole response id['+id+'], fName['+fName+'], fArgs['+fArgs+']');
    
    let retValue = undefined;
    switch(fName) {
      case '.eod.getTickers':
        retValue = {tickerList: fArgs};
        break;
      case '.eod.getExpirations':
        retValue = {expirations: fArgs};
        break;
      default:
        retValue = undefined;
        break;
    }
    console.log('tickerReducer.funcResponse return value ', retValue);
    return retValue;
  } else {
      return  {none: []}
  }
}
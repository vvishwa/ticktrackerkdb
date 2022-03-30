import {types} from '../types/tickerTypes.jsx'

export default function tickerReducer(state = {}, action) {
    const payload = {...action.payload};
    let finalState = {...state}
    switch (action.type) {
        case types.REDUX_WEBSOCKET_MESSAGE:
            finalState = funcResponse(action.payload.message, state)
            break;
        case types.SELECT_TICKER:
            finalState = {
                ...state, selectedTicker: payload
            }
            break;
        case types.SELECT_DATED:
            finalState = {
                ...state, selectedDatedDate: payload
            }
            break;
        default:
            console.log('tickerReducer:DEFAULT occur')
            finalState = {...state};
    }

    console.log('tickerReducer state = ', finalState, ', action = ', action)
    return finalState
}

const funcResponse = (msg, prevState) => {
    let tmp = JSON.parse(msg);
    let id = tmp[0];
    let fName = tmp[1];
    let fArgs = tmp[2];
    console.log('Whole response id[' + id + '], fName[' + fName + '], fArgs[' + fArgs + ']');

    let retValue = undefined;
    switch (fName) {
        case '.eod.getDatedDates':
            retValue = {...prevState, datedList: fArgs,};
            break;
        case '.eod.getTickers':
            retValue = {...prevState, tickerList: fArgs,};
            break;
        case '.eod.getExpirations':
            retValue = {...prevState, expirations: fArgs,};
            break;
        case '.eod.getOption':
            retValue = {...prevState, options: fArgs,};
            break;
        case '.sod.getTrades':
            retValue = {...prevState, trades: fArgs,};
            break;
        case '.sod.getPositionRaw':
            retValue = {...prevState, securitiesAccount: fArgs.securitiesAccount,};
            break;
        case '.sod.getUserPrincipal':
            retValue = {...prevState, userPrincipals: fArgs,};
            break;
        case 'td_quote_raw':
            retValue = {td_quote_raw: fArgs,};
            break;
        case 'td_chart':
            retValue = {td_chart: fArgs,};
            break;
        case 'td_futures_raw':
            retValue = {...prevState, td_futures_raw: fArgs,};
            break;
        case 'td_option_raw':
            retValue = {...prevState, td_option_raw: fArgs,};
            break;
        case 'getNews':
            retValue = {...prevState, news: fArgs,};
            break;
        default:
            retValue = {...prevState};
            break;
    }
    console.log('tickerReducer.funcResponse return value ', retValue);
    return retValue;
}
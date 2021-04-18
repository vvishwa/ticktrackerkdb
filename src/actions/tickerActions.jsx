import {types} from '../types/tickerTypes.jsx'

export const actions = {
    selectTicker(symbol) {
        return {
            type: types.SELECT_TICKER,
            payload: {symbol}
        };
    },
    selectDatedDate(datedDate) {
        return {
            type: types.SELECT_DATED,
            payload: {datedDate}
        }
    }
};
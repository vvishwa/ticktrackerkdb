import {types} from '../types/tickerTypes.jsx'

export const actions = {
    initTicker() {
        return {
            type: types.INIT_TICKER,
        };
    },
    newTicker(symbol) {
        return {
            type: types.NEW_TICKER,
            payload: {symbol}
        };
    },
    deleteTicker(symbol) {
        return {
            type: types.DELETE_TICKER,
            payload: {symbol}
        };
    },
    selectTicker(symbol) {
        return {
            type: types.SELECT_TICKER,
            payload: {symbol}
        };
    }
};
import { createStore, applyMiddleware } from 'redux';
import reduxWebsocket from '@giantmachines/redux-websocket';
import tickerReducer from '../reducers/tickerReducer.jsx';

// Create the middleware instance.
const reduxWebsocketMiddleware = reduxWebsocket();

export const store = createStore(tickerReducer, applyMiddleware(reduxWebsocketMiddleware));
import { createStore, applyMiddleware } from 'redux';
import reduxWebsocket from '@giantmachines/redux-websocket';
import rtReducer from '../reducers/rtReducer.jsx';

// Create the middleware instance.
const reduxWebsocketMiddleware = reduxWebsocket();

export const rtstore = createStore(rtReducer, applyMiddleware(reduxWebsocketMiddleware));
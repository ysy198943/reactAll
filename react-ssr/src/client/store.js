import { applyMiddleware, createStore } from 'redux'
import reducer from '../share/store/reducers'
import thunk from 'redux-thunk'

const store = createStore(reducer, window.INITIAL_STATE, applyMiddleware(thunk))

export default store;
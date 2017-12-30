import { createStore } from 'redux'

import rootReducer from './Reducers/'

const defaultState =  { 
    darkTheme: localStorage.getItem('darkTheme') === null ? false
    : localStorage.getItem('darkTheme') === 'true' ? true : false,

    autoTheme: localStorage.getItem('autoTheme') === null ? true
    : localStorage.getItem('autoTheme') === 'true' ? true : false
}

const store = createStore(rootReducer, defaultState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

export default store
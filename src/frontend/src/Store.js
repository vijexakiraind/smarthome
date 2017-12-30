import { createStore } from 'redux'

import * as actionCreators from './Actions/'
import rootReducer from './Reducers/'

const defaultState =  { 
    darkTheme: true,
    autoTheme: false
}

const store = createStore(rootReducer, defaultState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

export default store
import { createStore } from 'redux'

import rootReducer from './Reducers/'

import GetLocalIp from './Utils/GetLocalIp'

const defaultState =  { 
    darkTheme: localStorage.getItem('darkTheme') === null ? false
    : localStorage.getItem('darkTheme') === 'true' ? true : false,

    autoTheme: localStorage.getItem('autoTheme') === null ? true
    : localStorage.getItem('autoTheme') === 'true' ? true : false,

    myLocalIp: null
}

const store = createStore(rootReducer, defaultState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

GetLocalIp((err, ip) => {
    if(!err) {
        store.dispatch({ type: 'SET_MY_LOCAL_IP', payload: ip })
    }
})

export default store
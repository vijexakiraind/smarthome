import { createStore } from 'redux'

import rootReducer from './Reducers/'

import GetLocalIp from './Utils/GetLocalIp'
import ScanForServer from './Utils/ScanForServer'

import * as ActionCreators from './Actions/'

const defaultState =  { 
    darkTheme: localStorage.getItem('darkTheme') === null ? false
    : localStorage.getItem('darkTheme') === 'true' ? true : false,

    autoTheme: localStorage.getItem('autoTheme') === null ? true
    : localStorage.getItem('autoTheme') === 'true' ? true : false,

    autoIPs: localStorage.getItem('autoIPs') === null ? true
    : localStorage.getItem('autoIPs') === 'true' ? true : false,

    myLocalIp: null,

    serverLocalIp: localStorage.getItem('serverLocalIp') === null ? '192.168.1.10'
    : localStorage.getItem('serverLocalIp'),

    serverGlobalIp: localStorage.getItem('serverGlobalIp') === null ? null
    : localStorage.getItem('serverGlobalIp'),

    uis: [],
    vars: [],
    varvalues: {}
}

const store = createStore(rootReducer, defaultState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

GetLocalIp((err, ip) => {
    if(!err) {
        store.dispatch({ type: 'SET_MY_LOCAL_IP', payload: ip })

        //ScanForServer(ip, (err, res) => console.log(err, res))
    }
})

if(true) {
    store.dispatch(ActionCreators.AppendUis([
        {
            "title": "Lamp",
            "type": "power-switch",
            "connections": [
                "bedroom-lamp-state"
            ]
        },
        {
            "title": "Idk man",
            "type": "power-switch",
            "connections": [
                "other-lamp-state"
            ]
        }
    ]))

    store.dispatch(ActionCreators.UpdateVars({
        "bedroom-lamp-state": 0,
        "other-lamp-state": 1,
        "bedroom-light-level": 0
    }))
}

export default store
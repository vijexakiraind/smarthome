// import { compose } from 'redux'

const rootReducer = (state, { type, payload }) => {
    switch(type) {
        case 'TEST_ACTION': {
            return {...state, msg: payload.msg}
        }
        case 'SET_DARK_THEME': {
            return {...state, darkTheme: payload}
        }
        case 'SET_AUTO_THEME': {
            return {...state, autoTheme: payload}
        }
        case 'SET_MY_LOCAL_IP': {
            return {...state, myLocalIp: payload}            
        }
        default: {
            return state
        }
    }
}

export default rootReducer
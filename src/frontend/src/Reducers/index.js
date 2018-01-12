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
        case 'SET_AUTO_IP_CONFIG': {
            return {...state, autoIPs: payload}  
        }

        case 'SET_SERVER_LOCAL_IP': {
            return {...state, serverLocalIp: payload}  
        }


        case 'APPEND_UIS': {
            return {...state, uis: [...state.uis, ...payload]} 
        }

        case 'UPDATE_VARS': {
            return {...state, varvalues: payload }
        }

        case 'SET_VAR_VALUE': {
            return {
                ...state,
                varvalues: {
                    ...state.varvalues,
                    [payload.name]: payload.value
                }
            }
        }

        default: {
            return state
        }
    }
}

export default rootReducer
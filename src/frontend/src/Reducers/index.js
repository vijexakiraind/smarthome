// import { compose } from 'redux'

const rootReducer = (state, { type, payload }) => {
    switch(type) {
        case 'TEST_ACTION': {
            return {...state, msg: payload.msg}
        }
        case 'SET_DARK_THEME': {
            return {...state, darkTheme: payload}
        }
        default: {
            return state
        }
    }
}

export default rootReducer
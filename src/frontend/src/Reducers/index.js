// import { compose } from 'redux'

const rootReducer = (state, { type, payload }) => {
    switch(type) {
        case 'TEST_ACTION': {
            return {...state, msg: payload.msg}
        }
        default: {
            return state
        }
    }
}

export default rootReducer
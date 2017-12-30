import axios from 'axios'
import Store from '../Store'

export function TestAction(msg) {
    return {
        type: 'TEST_ACTION',
        payload: { msg }
    }
}
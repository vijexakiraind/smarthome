import axios from 'axios'
import Store from '../Store'

export function TestAction(msg) {
    return {
        type: 'TEST_ACTION',
        payload: { msg }
    }
}

export function SetDarkTheme(dark) {
    return {
        type: 'SET_DARK_THEME',
        payload: dark
    }
}
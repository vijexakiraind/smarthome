//import axios from 'axios'
//import Store from '../Store'

export function TestAction(msg) {
    return {
        type: 'TEST_ACTION',
        payload: { msg }
    }
}

export function SetDarkTheme(dark) {
    localStorage.setItem('darkTheme', dark.toString())
    return {
        type: 'SET_DARK_THEME',
        payload: dark
    }
}

export function SetAutoTheme(auto) {
    localStorage.setItem('autoTheme', auto.toString())
    return {
        type: 'SET_AUTO_THEME',
        payload: auto
    }
}

export function SetAutoIPs(auto) {
    localStorage.setItem('autoIPs', auto.toString())
    return {
        type: 'SET_AUTO_IP_CONFIG',
        payload: auto
    }
}

export function SetServerLocalIp(ip) {
    localStorage.setItem('serverLocalIp', ip)
    return {
        type: 'SET_SERVER_LOCAL_IP',
        payload: ip
    }
}

export function AppendUis(uis) {
    return { 
        type: 'APPEND_UIS',
        payload: uis
    }
}
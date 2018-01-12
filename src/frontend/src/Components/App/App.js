import React from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actionCreators from '../../Actions/'

import Client from '../Client/Client'
import Notification from '../Notificaton/Notification'
import Menu from '../Menu/Menu'

import './App.css'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            notifications: []
        }

        const { darkTheme } = this.props.AppState

        if(/Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent) &&
            !window.matchMedia('(display-mode: standalone)').matches ) {
                const key = this.state.notifications.length
                this.state.notifications.push(
                    <Notification
                        dark={darkTheme}
                        key={key}
                        close={this.closeNotification.bind(this, key)}
                        text={'Add this app to home screen'}
                        sub={<a href="https://www.howtogeek.com/196087/" rel="noopener noreferrer" target="_blank">How?</a>}
                        />
                )
        }

        if(darkTheme) {
            document.body.classList.add('dark-theme')
            document.getElementById('meta-theme-color').setAttribute('content', '#2b2b2b')
        }
        else {
            document.body.classList.add('light-theme')
            document.getElementById('meta-theme-color').setAttribute('content', '#eaeaea')
        }
    }

    closeNotification(i) {
        this.setState({
            // eslint-disable-next-line
            notifications: this.state.notifications.filter(n => n.key != i)
        })
    }

    render() {
        const { darkTheme } = this.props.AppState

        if(darkTheme) {
            document.body.classList.add('dark-theme')
            document.body.classList.remove('light-theme')
            document.getElementById('meta-theme-color').setAttribute('content', '#2b2b2b')
        }
        else {
            document.body.classList.add('light-theme')
            document.body.classList.remove('dark-theme')
            document.getElementById('meta-theme-color').setAttribute('content', '#eaeaea')
        }

        return (
            <div className="App">
                { this.state.notifications }
                <div className="clients-container">
                    { this.props.AppState.uis.map((ui, i) => <Client key={i} ui={ui} setVar={console.log} />) }
                    <Client empty />
                </div>
                <Menu
                    dark={darkTheme}
                    autoTheme={this.props.AppState.autoTheme}
                    setTheme={this.props.SetDarkTheme}
                    setAutoTheme={this.props.SetAutoTheme}

                    autoIPs={this.props.AppState.autoIPs}
                    setAutoIPs={this.props.SetAutoIPs}

                    serverLocalIp={this.props.AppState.serverLocalIp}
                    serverGlobalIp={this.props.AppState.serverGlobalIp}
                    setServerLocalIp={this.props.SetServerLocalIp}
                />
            </div>
        )
    }
}

function mapStateToProps(AppState) {
    return {
        AppState
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

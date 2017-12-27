import React from 'react'

import Client from '../Client/Client'
import Notification from '../Notificaton/Notification'
import Menu from '../Menu/Menu'

import './App.css'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            notifications: [],
            darkTheme: true
        }

        if(/Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent) &&
            !window.matchMedia('(display-mode: standalone)').matches ) {
                const key = this.state.notifications.length
                this.state.notifications.push(
                    <Notification
                        key={key}
                        close={this.closeNotification.bind(this, key)}
                        text={'Add this app to home screen'}
                        sub={<a href="https://www.howtogeek.com/196087/" rel="noopener noreferrer" target="_blank">How?</a>}
                        />
                )
        }

        if(this.state.darkTheme) {
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

    toggleDarkTheme() {
        this.setState({ darkTheme: !this.state.darkTheme })
        
        if(this.state.darkTheme) {
            document.body.classList.add('dark-theme')
            document.body.classList.remove('light-theme')
            document.getElementById('meta-theme-color').setAttribute('content', '#2b2b2b')
        }
        else {
            document.body.classList.add('light-theme')
            document.body.classList.remove('dark-theme')
            document.getElementById('meta-theme-color').setAttribute('content', '#eaeaea')
        }
    }

    render() {
        return (
            <div className="App">
                { this.state.notifications }
                <div className="clients-container">
                    <Client />
                    <Client />
                    <Client />
                    <Client empty />
                </div>
                <Menu />
            </div>
        )
    }
}

export default App;

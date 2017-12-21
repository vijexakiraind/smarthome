import React from 'react'

import Client from '../Client/Client'
import Notification from '../Notificaton/Notification'

import './App.css'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            notifications: [],
            darkTheme: false
        }

        if(/Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent) &&
            !window.matchMedia('(display-mode: standalone)').matches ) {
                this.state.notifications.push(
                    <Notification
                        key={this.state.notifications.length}
                        close={this.closeNotification.bind(this, 0)}
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
                </div>
            </div>
        )
    }
}

export default App;

import React from 'react'

import './Notification.css'
import closeIcon from './close.svg'

export default class Notification extends React.Component {
    render() {
        return (
            <div className="Notification pwa">
                <div className="Notification-info">
                    <div className="Notification-title">
                        Add this app to home screen
                    </div>
                    <div className="Notification-sub">
                        <a href="https://www.howtogeek.com/196087/" rel="noopener noreferrer" target="_blank">How?</a>
                    </div>
                </div>
                <div className="Notification-action" onClick={this.props.close}>
                    <img src={closeIcon} alt="Close" />
                </div>
            </div>
        )
    }
}